# Handoff: where the Beck To Nature site stands

Written so that anyone on the team (with or without Claude) can continue. Update this file whenever you finish a piece of work.

Last updated: 2026-11-12, after the journey rebuild and its zoom and easing revision (see "Latest pass: the journey" below).

## What the site is

Beck To Nature takes Central European manufacturers to US trade shows. It is run by one person, but the site speaks as a company ("we", "our founder"). The company is **Beck To Nature LLC**, a North Carolina LLC (formed 2011, active again from November 2026), led by Dr. Ildikó Beck.

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

## Added on 2026-11-13: principles pass and the artifact copy

The owner shared three references (20 UX and animation principles, 22 backgrounds to make designs less flat, and a Revolut form breakdown with "show the value in the row, group, make risky things obvious"). Applied:

- **Form, Revolut-style:** the answers so far sit as a row of small values above the question; each one reopens its question (show the value, don't make people go back to check). Phone and email show a small check once they will work. Steps change in 280ms (was 480).
- **Feedback:** buttons squash quickly when pressed and spring back (anticipation, follow-through, under 300ms); the check on a picked answer pops (squash and stretch, exaggerated feedback). Links in the menu and footer have bigger hit areas than they look (Fitts).
- **Less flat:** a fine speckle over the whole page, drawn with an SVG noise filter inside the CSS (no image file, no outside request). Off with reduced motion.
- Kept from the "frequency of use" rule: nothing that is used often (menu, links) animates on hover beyond a colour change.

**The artifact copy** (a self-contained copy of the site published as a Claude artifact) was tried on 2026-11-13. The owner found it poor, so it was removed from the repo (it is in git history at f666f5b). Show the site with videos instead (`design/tools/record-preview.js`).

## Added on 2026-11-13: the site is built around Ildi Beck

The owner sent a document about Dr. Ildikó Beck (the company is built around her) and asked to use it to rethink the site, to drop the three specialty cards ("AI-ish"), and to stop showing the Budapest and Chicago labels during the flight.

- **New order below the flight:** Ildi (photo, one line, her facts as label/value rows) → Areas of expertise (four rows, area and proof, no cards, then one line on how she works and "Work with Ildi") → the inquiry → Selected engagements (three real stories) → footer.
- **Facts used** (from her document): founder and managing director; in the US market since 2004; 11 years at GE HealthCare, 2004 to 2009 in Wisconsin and then in global roles; PhD in chemical engineering, Budapest University of Technology, 2007; American citizen; AmCham Hungary board member 2018 to 2022; led an AI program for organ outlining on CT for radiotherapy and supported its FDA 510(k) preparation; built and led a 26-person data team; crib mattresses through CPSC-accepted lab testing, labelling and registrations; ABC Kids Expo (Las Vegas, Nashville), New York, Atlanta; Heartbit at CES; Bebeyo and Nosiboo at ABC Kids Expo.
- **Not used on purpose:** anything about the LiveStocker grant application (a client's confidential project), the company's street address, and her personal email.
- **To confirm with Ildi before launch:** that Heartbit, Bebeyo and Nosiboo may be named; her photo; whether the street address (Wake Forest, NC) may appear in the legal pages (they now say Beck To Nature LLC, North Carolina, with the street as a placeholder).
- **The form's industries** now follow her expertise: Medical & healthcare, Software and AI, Consumer products, Something else.
- **Flight:** the Budapest and Chicago labels are gone.
- **Nav:** Why trade shows, Ildi Beck, Expertise, Inquiry, Track record.

## Hosting: GitHub Pages (added 2026-11-14)

- `.github/workflows/pages.yml` builds a static copy on every push to `main` and publishes it to https://beqck00.github.io/beck-to-nature-website/.
- **Live since 2026-11-16.** The repository is public and Pages is set to Source: GitHub Actions (both done by the owner). Every push to `main` redeploys in about two minutes.
- The static copy is built with `GITHUB_PAGES=1` (see `next.config.ts`): Next's static export under the `/beck-to-nature-website` base path, trailing slashes, and without `app/api` (the workflow deletes it before building).
- **The form cannot send on GitHub Pages** (there is no server). It ends with "open in your email app", with the answers filled in. To have it send, host on something with a server (e.g. Vercel) or point the form at a form service, and update the privacy policy to name it.
- Every root-relative link or image path must go through `at()` from `lib/base.ts`, or it breaks under the base path. With a custom domain (e.g. becktonature.com) set `PAGES_BASE_PATH` to an empty string in the workflow.
- Test the static copy locally: `rm -rf app/api` in a copy of the repo, `GITHUB_PAGES=1 npx next build`, then serve `out/` under `/beck-to-nature-website/`.

## What the owner taught (read before designing anything)

Collected from the whole conversation with the owner, so a new session does not have to rediscover it.

**Motion**
- Never linear. Everything eases: out (fast, then slower) for things arriving, in-out (slow, fast, slower) for moves between states. In code: `expoOut` / `expoInOut` in `lib/fx/util.ts`, `--ease` in CSS, `expo.out` in GSAP.
- The 20 principles the owner shared (Disney's 12, Laws of UX, Emil Kowalski): squash and stretch; anticipation (a small pull back before a big move); staging (one focus at a time); pose to pose; follow-through (parts settle after the main body stops); slow in and slow out; move in arcs, not straight lines; secondary action (a small flourish that backs up the main one); snappy timing (UI feedback under 300ms); exaggerated feedback (push past real so the moment lands); solid drawing (depth and volume); overall appeal; Fitts's law (bigger, closer targets); bigger hit areas than they look; Hick's law (fewer choices); Miller's law (chunk into about 7); Doherty threshold (respond within 400ms); Postel's law (accept messy input, give back clean output); Jakob's law (work like the sites people already use); frequency of use (the more often something is used, the less it should animate).
- Scrolling should feel like a journey: the line follows you; between sections it runs out of frame while the view zooms in, then the view settles out onto the next section. Little empty space while travelling. It should make people want to keep scrolling, never feel boring.

**The gold line**
- Starts from the hero "Beck" signature; ends by writing the closing signature bottom left, joined at the B.
- Smooth and calm: no loops, no zigzag, no sharp or tight turns anywhere (a minimum turn radius is enforced).
- May pass behind text and under cards; does not wrap around the inquiry card.
- Fine stroke with a subtle glow; lights things as it passes; follows faster when you scroll faster.

**Look**
- Black with brass and cream, EB Garamond. No onyx (the owner went back and forth; the current decision is none). No glows, drop shadows or gradients on cards; solid tone-on-tone panels.
- Less flat backgrounds are welcome when subtle. The owner's list of ideas: felt, fluted glass, thermal gradients, water ripples, speckled graphite (in use), single-hue landscapes, blueprint grids, halftone, grainy gradients, grass, dithered images, paper, contour lines, cloud sky, pixel mosaics, lens distortion, stippled gradients, square-dot grids (the dotted map), blurred photos, iridescent shapes, impressionist paintings, ASCII and pixels.
- Uncluttered, generous but not empty spacing; short text ("people won't read it"); italic accent words only in "to America." and "inquiry.".
- Text easy to read: body 18px or more, light greys on black.

**Content and voice**
- Company voice: "we", "our founder", never "I" or "my". Never claim "we'll be at your booth".
- Every section leads to the inquiry. No pricing, FAQ, logo strip or testimonials.
- The site is built around Dr. Ildikó Beck: her record is the proof. No three-card layouts ("AI-ish"); use rows, facts and real stories.
- US-based LLC; legal drafts need a lawyer.

**The inquiry form (the main call to action)**
- One question at a time, six steps; choice cards with a title, a muted subtitle and a corner check.
- Revolut-style: show the value already given instead of making people check; group things; one clear next action; risky things look risky; every small interaction reduces effort and builds confidence.

**Working with the owner**
- Show progress as a video of the site (desktop and phone), not an artifact.
- Upload everything to GitHub as you go, so the other two people can continue when credits run out. Keep this file current.

## Task list for the next session (for Claude Fable)

The owner will switch to Claude Fable and say "continue". Work down this list; tick items off here (change `[ ]` to `[x]`) and push after each one. Record a video at the end and send it.

### Heavy work (for Fable)

1. [ ] **Review the whole scroll against the 20 principles**, frame by frame on desktop and phone (record, then step through the video). Fix every linear or abrupt move, every place where two things compete for attention (staging), and every pause with nothing on screen.
2. [ ] **The journey's zoom, tuned by eye.** Each handover between sections: the line darts out of frame, the view closes in fast then slower, rides the line, and pulls back slowly onto the next section. Check the amounts (`zoom`, `CLOSE_IN`, `PULL_BACK`, `TRAVEL` in `lib/fx/journey.ts`) so it feels lively but never seasick, and that there is always something on screen (the dot field, the line's head, the next section arriving).
3. [ ] **Anticipation and follow-through in the journey.** A slight pull back of the view before it closes in (anticipation); after it settles on a section, let the section's parts arrive a beat apart and settle (follow-through, secondary action). Keep each under a second.
4. [ ] **Move in arcs.** Section parts that rise in should travel on a slight curve, not straight up. The camera's path between sections should curve, not cut diagonally.
5. [ ] **Line geometry check.** Measure the tightest turn of both lines (flight and journey) on desktop, a 1024px laptop and a phone; keep it at or above the current minimums. Make sure the line never crosses a word in a heading.
6. [ ] **The form, Revolut breakdown applied fully.** Bigger, calmer type for the question; the answer row grouped and readable; a clear "ready" state on Continue once the step is valid; Enter always moves on; the phone field accepts any format and shows it back cleanly (Postel); the dial and map feel physical (squash on grab, settle on release). Test every step with keyboard only, mouse, and touch.
7. [ ] **A second background texture, carefully.** Try one more of the owner's "less flat" ideas where it supports the story, for example faint contour lines or a blueprint grid behind the inquiry, or stippled grain on the founder section. Subtle; no new requests to other sites; record before and after for the owner.
8. [ ] **Solid drawing and overall appeal.** Give the specialty cards and the form a sense of depth without glows or shadows (tone steps, edges, the way they move on hover and press).
9. [ ] **Performance.** Smooth scrolling on a mid-range laptop and phone: profile the flight's canvas and the journey; cut work per frame where it stutters. The Doherty threshold applies to every response.
10. [ ] **Real devices.** If a device or browser preview is available, check iPhone Safari (pinned stages and the address bar), Android Chrome, desktop Safari and Firefox. Note anything that cannot be checked.

### Light work (done on 2026-11-13, before switching)

- [x] Videos instead of artifacts: rule added to `CLAUDE.md`; the artifact copy removed.
- [x] Fresh recordings in `design/preview/`.
- [x] Progress dots on the form react in 240ms (UI feedback under 300ms).
- [x] Earlier the same day: answers-so-far row in the form, checks on valid phone and email, press squash on buttons, pop on picked answers, bigger hit areas on small links, speckled-graphite texture.

### Waiting on the owner (nobody can do these without them)

- Founder name, photo, quote and four short texts; the two case stories; the show names on the specialty cards.
- The LLC's legal name, state and address; a lawyer's review of the legal pages.
- Hosting (Vercel suggested), an email account for the form (Resend), an SMS provider if texts are wanted.

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

## Added on 2026-11-18: hero lines and tab icon

- The hero now has three gold lines instead of five routes with moving dots. Each line draws itself from a European city to an American one (head fast then slower, tail slow, fast, slower), rests, and its tail follows it home; then it starts again between two new cities, never a city another line is using (`HUBS`, `EU`, `US`, `lane()`, `pick()`, `tend()` in `lib/fx/flight.ts`). Only the ends of a live line glow.
- The browser-tab icon is the gold figure on a black rounded square: `public/logo/favicon-gold.svg`.
- `npm run build` sometimes stops once with a Next.js "known security vulnerability" notice (a moderate advisory for `next` up to 16.4.4, about `use cache`, which this site does not use); running it again builds. Upgrading `next` is a pending decision for the owner.

## Changed on 2026-11-18: back to a plain scroll (the journey is gone)

- **The owner asked to remove the zoom-in line transition between sections.** Below the flight the page is again an ordinary page that scrolls straight down. The gold line draws itself down it as you scroll (faster when you scroll faster) and still ends by writing the closing signature, joined at the B. Code: `lib/fx/thread.ts` (restored from before the journey and fitted to the Ildi sections: through her photo, down the edge beside her expertise, behind the form, between a story and its facts; slow S-curves on phones). `lib/fx/journey.ts` was deleted. Older notes in this file about the journey, its camera and its zoom are history.
- Sections rise in as they scroll into view (headings word by word, then their blocks) and go back when scrolled past upwards; done with an IntersectionObserver in `thread.ts` and the `.scene` rules in `app/globals.css`.
- The landing after the flight now shows one centred sentence ("Put your product in front of American buyers *before* you commit to America."); the "One booth. One week. A clear answer." heading beside it was removed (the three statements still play during the flight).
- The map's fade at the bottom of the flight is now a mask on the map canvas, not a dark overlay, so there is no visible seam where the flight meets the next section.
- Some items in the Fable task list above (journey zoom tuning) no longer apply.

## Added on 2026-11-18: animation rules and grey dark mode (from the owner; apply them to every UI)

**Animation rules**
- Entrances start from scale 0.97 and opacity 0, never from scale 0 (section blocks, the "thank you" card, the answer chips).
- Buttons scale to 0.97 while pressed (`transition: transform 150ms ease-out`). No bounce on everyday UI.
- A wrong answer shakes the step (translateX 0, -10, 10, -6, 6, -3, 0px over 360ms) *and* turns the field red (`.step.bad`).
- Steppers slide the next step in from the direction you are going (the form already does: `stepIn` / `stepBack`).
- Accordions: `:root { interpolate-size: allow-keywords }` is set, so `height: auto` animates.
- Move things with transform, never top or left (the skip link now slides with transform).
- Theme switches: turn transitions off while switching (`.theme-switching * { transition: none !important }`). The site has no theme switch today.
- Tooltips: delay only the first one; once one is open, show the rest instantly. (No tooltips today.)
- Flicks and drags hand off to a spring that keeps the release speed, not a fixed-length tween: the month dial does this (`spring()` in `lib/dial.ts`).
- Past either end of a drag (the dial, any future carousel), resistance grows the further you pull, then it springs back (`band()` in `lib/dial.ts`).
- **The end of every page gives a little:** scroll past the bottom and the last part lifts with growing resistance, then springs back, so the page reads as ended, not frozen (`lib/fx/endBounce.ts`, elements marked `data-bounce`). Apple devices do this natively, so it is left to them there; off with reduced motion.

**Dark mode: grey, not black.** White text on pure black seems to vibrate and shadows vanish. The field is now dark grey (`--k1` #121211, page gradient #0F0F0E to #161514). Layers get lighter the higher they sit, like stacked layers under a flashlight: page `--k1`, cards `--k3` (#1C1B1A), things on a card `--k4` (#242321: answer chips, inputs), selected chips and sheets `--k5` (#2E2C29: the "thank you" card), with the page dimmed behind a sheet. Shadows may stay, but they never separate layers on their own.

**Other notes from the same message:** a play button's triangle should be nudged slightly right so it looks centred (none on the site yet). For settings-style lists: group rows under titles, show the current value in the row, an arrow means "opens a screen", and a destructive action (such as delete account) is red, at the bottom, with no arrow.

## Changed on 2026-11-19: on scroll the hero's lines run to their end cities

- **Replaced the same day at the owner's request:** when the visitor starts to scroll, each of the three hero lines runs on to its own end city in America instead: one after another (the line nearest its end goes first, 260ms apart), each over 1.3s on its own clock rather than tied to the scroll, so the pace stays graceful however fast the visitor scrolls: the head finishes its flight first, then the tail follows it in (expoInOut: slow, fast, slower), and the destination city stays lit until the hero fades. Scrolling back to the top reverses it a fifth faster. Constants `RUN_ONE`, `RUN_GAP`. Lines that had not left yet fly the whole way. Scrolled back to the top, they carry on from the same moment. Code: the `q` / `frozenAt` part of the hero drawing in `lib/fx/flight.ts`.
- The three lines run on one fixed cycle, a third of a cycle apart, so one is always moving.
