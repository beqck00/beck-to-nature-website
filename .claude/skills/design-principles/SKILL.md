---
name: design-principles
description: The Beck To Nature owner's design principles, gathered from every instruction, review and reference they gave while the website was built. Read it before designing, restyling, animating, writing copy for, reviewing or coding any part of the website (or anything else for the brand), and when deciding whether a piece of code is needed at all. It covers the brand, voice, colour and dark-mode layers, type, layout, the signature and gold line, the hero map, scroll story, every motion rule, interaction laws, the inquiry form, mobile, textures, legal limits, how the owner wants work shown and shared, and how code must be written (use what the browser already provides; nothing unnecessary).
---

# Design principles

These are the owner's design principles for Beck To Nature. Every rule here comes from something the owner said, showed
or approved while the site was built (their own words are in [references/owner-words.md](references/owner-words.md)),
or from a skill they installed and asked to be used. The audit of the site's code, file by file, is in
[references/code-audit.md](references/code-audit.md).

## 0. How to use this

1. **The owner decides.** Order of authority: the owner's latest message → this file → the owner's earlier messages →
   the installed skills (section 20) → general taste. When two of the owner's messages disagree, **the later one wins**
   (the onyx stone was added, removed, brought back and removed again; the line once zoomed between sections and now
   does not). This file records where each decision ended up.
2. **Read before you touch anything.** Read `design/HANDOFF.md` (what is built, what is open) and this file before you
   design, animate, write copy or code.
3. **Every rule has a reason.** Apply a rule where its reason applies. If a rule seems wrong for a new case, say so and
   ask; do not quietly break it.
4. **Show, then ask.** When the owner wants to see something, send a short **video** (not an artifact, not a pile of
   screenshots). Check your own work with screenshots first.
5. **Keep it shared.** Three people work on this repo in turn. Finished work is committed and pushed to `main`, and
   `design/HANDOFF.md` is updated, so the next person can continue.

---

## 1. Who we are and what the site is for

- **Beck To Nature LLC**, a North Carolina LLC (Wake Forest, NC). It takes Central European manufacturers (Hungary
  first) to US trade shows. The company is built around **Dr. Ildikó Beck** (Ildi), its founder: twenty years of taking
  regulated products to new markets, eleven of them at GE HealthCare, in the US market since 2004, PhD in chemical
  engineering, American citizen, former AmCham Hungary board member.
- **One person, one premium service.** The site sells trust in her, not a product catalogue.
- **Why trade shows** (the owner's reasoning, and the site's argument): a show is a controlled place to test a product
  on the US market, meet buyers, collect leads, study competitors, check real demand and find faults that need fixing,
  and you can bring a prototype; you don't need the final product. "One booth. One week. A clear answer."
- **Specialisms:** medical technology and pharma, AI and medical software, regulated consumer products, trade shows
  and buyers. "We're good at everything, but that's what we're specialized at."
- **Audience:** owners and managers of manufacturers, including hospital and medical suppliers and older buyers.
  They must be able to read everything easily and trust it.
- **The single goal: the inquiry.** "The entire point of the website is going to be to go to the inquiry." "We want
  them to buy buy buy." Every section ends by leading to the form; nothing on the page competes with it.
- **Not on the site, by decision:** pricing or tiers ("this is a premium service", nothing that feels mid-level or like
  a subscription), FAQ, a logo strip of clients, "Book a free call" ("that's not premium"), the moving "Trusted by"
  strip (asked for once, then dropped with the logo strip), three-card feature grids.
- **Sections, in order:** the opening flight (hero map, headline, signature) → the landing sentence ("Put your product
  in front of American buyers *before* you commit to America.") → Dr. Ildikó Beck (photo, one line, facts) → Areas of
  expertise (four rows, one line on how she works, "Work with Ildi") → Start your inquiry (the form) → Selected
  engagements (three real stories, "Write your own story") → footer with the closing signature.
- Keep sections few. "We may remove some sections bc we want people to inquire." Put the inquiry high.

## 2. Voice and copy

- **"We" and "our founder", never "I" or "my".** "This is a professional company, talk like it."
- **Professional, not chatty.** "What she has done" → "Selected engagements". "Where she goes deepest" → "Areas of
  expertise". Prefer the words a serious firm would use about its own record.
- **Short.** One line where one line works. Cut copy before you shrink type. Six questions, "About a minute."
- **No promises we can't keep.** "We wouldn't be at your booth" was corrected: say only what the company actually does.
  Results are facts (who, which show, what happened), never hype.
- **No hype words, no exclamation marks** in interface text (unslop): no "revolutionize", "seamless", "unlock",
  "game-changing", no "AI-powered" on everything.
- **Placeholders stay visible** as `<Ph>[...]</Ph>` until the owners fill them in. Never invent a fact to fill one.
- **Client names** (Heartbit, Bebeyo, Nosiboo, the crib-mattress brand) are used as Ildi gave them; confirm each may
  be named before launch. Private details (her email, the street address, grant details) stay off the public site.
- **Legal pages** are drafts for a US LLC (General Legal templates, CC0) and have not been reviewed by a lawyer. Never
  present them as final.

## 3. Colour

### How we got here (so nobody re-litigates it)
- First draft: monochrome, very dark, premium, "never put two very contrasting blackish colours next to each other,
  rather gradient it", light spotlight-like spots, liquid glass, silver that pops, a tactile feel.
- Silver → **brass gold** ("use brass gold instead of silver and make it look metallic and premium"). Rose gold was
  tried with the same principles; **"I like brass gold best."**
- Liquid glass was tried, reworked, then **removed**.
- Onyx stone: "use this onyx wall everywhere" → "make everything onyx toned" → "go back to the black tone + original
  onyx pattern" → used small, tastefully, only to draw the eye to one place → removed from the form → "remove the onyx
  pattern" → "bring back the onyx pattern" → "revert the onyx pattern". **Current state: no onyx anywhere.**
- An outside review said black and gold reads as luxury/law/finance and suggested a light page; the owner chose to
  **stay dark and gold**, with bigger text and fewer italics.
- 2026-11-18: **dark grey, not black.** "Most dark modes use grey not black; white text on pure black looks like it
  vibrates and shadows disappear."

### The palette (tokens in `app/globals.css`)
| Token | Value | Use |
| --- | --- | --- |
| `--k0` | `#0E0E0D` | the darkest edge of the page gradient |
| `--k1` | `#121211` | the page (body, header fade, theme-color) |
| `--k2` | `#171716` | sunken areas (form map background, legal header pill) |
| `--k3` | `#1C1B1A` | cards (the form card, the portrait placeholder, legal callouts) |
| `--k4` | `#242321` | things on a card (answer chips, inputs, the quiet button) |
| `--k5` | `#2E2C29` | selected chips, sheets (the "thank you" dialog) |
| `--ink` / `--ink-2` / `--ink-3` | `#F1EADD` / `#D6CCBC` / `#B4A996` | text: primary, secondary, muted. Never pure white. |
| `--cream` | `#EBD3A6` | the brass-gold accent: the main button, the line, the needle, selected marks, "to America" |
| `--cream-hi` | `#FBF1DE` | hover on the main button, the needle's head |
| `--on-brass` | `#17120C` | text on cream |
| `--signal` | `#E8B4A0` | errors (a warm red that sits inside the palette) |
| `--glow` | `240,198,130` | the line's soft glow (low opacity only) |

### Rules
- **Elevation by colour, not shadow.** Think of stacked layers under a flashlight: the higher the layer, the more light
  it gets. The page is darkest; cards are lighter; anything on a card is lighter again; a sheet or dialog is lighter
  still and everything behind it dims (over a map you may skip the dim, but the sheet must still be lighter). Shadows
  may stay, but they never separate layers on their own. (iOS: elevated background colours; Material 2: more white the
  higher a surface sits; Material 3: a surface colour per component.)
- **A control on a surface is lighter than that surface.** (The "Back to the form" button on the dialog is `#3A3834`,
  above `--k5`.)
- **One accent, used rarely:** the brass cream marks the main action, the selection, and one word or line that
  matters. Never a second accent colour. The old brand lime green/brown stays in the logo files, not on the site.
- **No two very different darks side by side.** The page tone shifts gently (`.page` gradient `#0F0F0E` →
  `#161514` and back), never in bands with visible edges. "Blend these two pages, there's an obvious line" — sections
  must flow into each other with no seam (the map fades with a mask, not a dark overlay).
- **No glows, shadows or gradients on cards.** Flat surfaces, hairline borders at 6–12% opacity of the cream.
- **Readable contrast.** Body text is light (`--ink`/`--ink-2`), never small grey on black. Muted text (`--ink-3`) only
  for labels and meta.
- **Metallic feel without gloss.** The premium feel comes from the brass colour, restraint and motion, not from
  bevels, chrome gradients or glow.

## 4. Type

- **EB Garamond**, self-hosted from `app/fonts/` (variable roman and italic, woff2; licence `app/fonts/OFL.txt`). No
  font requests to other companies. (Neue Montreal was shown as a reference for a grotesque; the owner chose EB
  Garamond for the site.)
- **Big and readable.** Body 18px minimum (legal pages 20px), 19px for lead lines, line-height about 1.5. Headlines
  are large serif with slight negative tracking (`-0.02em`), line-height about 1.
- **Hierarchy by size and colour, weight 400/500.** No heavy bold headings.
- **Italic sparingly.** The italic accent word ("specialize.", "inquiry.", "founder.") repeated in every heading turned
  into a template; now it is used once or twice: "*to America.*" in the hero, "*inquiry.*", "*before*" in the landing
  sentence.
- **Tabular, lining figures** wherever numbers change (the dial uses `tabular-nums` so nothing shifts).
- **Headlines short:** two lines or fewer at every width. Headings and the title have the **same space above and
  below** where they sit between blocks ("make the title have the same space above and under").
- **Inputs at 16px or more** (ours inherit 18px) so iPhone never zooms into them.

## 5. Layout and spacing

- **Uncluttered.** "Make every card and thing a little bit smaller and less cluttered." "Rework the spacing and the AI
  clutteredness." Remove before you add.
- **No three-card layouts, no cards on cards.** "The 3 card is very AI-ish." "I hate … cards upon cards." Show lists as
  **rows** (expertise: the area in large type, the proof beside it; facts: label left, value right; stories: result
  large, facts beside it), separated by hairlines and space.
- **No large empty gaps.** "Remove some of the empty space." Sections are separated by one rhythm (`--sec`: 120–200px),
  a heading sits `--head` (48–80px) above its content; everything else on a 4px grid. Space inside a group is smaller
  than space between groups.
- **One alignment logic.** The review found the layout switching between left, centre and split; keep one: sections
  left-aligned in a 1240px frame, the hero, landing sentence and inquiry head centred.
- **Centre what is the focus.** The headline and the landing sentence are centred; "remove the text on the left and set
  the focus on the one on the right".
- **The form is the visual focus of its section** ("make the inquiry form more of the focus").
- **The header:** logo (figure + wordmark, cream), up to five section links, one small "Start your inquiry" button
  (38px tall, 16px text, a 44px tap area). The header fades out of the page; no floating pill.
- **Phones get the same composition as the desktop** ("change the layout to be like the pc one"): the map sits behind
  the centred headline, not in a strip at the bottom, and **fills the screen from top to bottom** when the page opens
  ("I want the map to be from top to bottom everywhere"). To make that work on a portrait screen the phone map leaves
  out the empty mid-Atlantic, so America's east coast and Western Europe sit side by side, zoomed in; it eases out to
  the whole map as the visitor starts to scroll.
- **Text the line passes through** is acceptable; the line may run behind text and under cards, but never wraps around
  the inquiry card.

## 6. The signature and the gold line

The owner's signature ("Beck") turns into a single gold line that you follow down the whole site. It is the brand's
signature detail; everything about it is deliberate.

- **The signature is one continuous stroke**, as on paper; the letters connect ("you separated the C and made it
  smaller so it doesn't connect" was a bug). It reads "Beck" the right way up (it was once flipped). It sits bottom
  centre of the hero, modest in size, and writes itself on load (slow, fast, slower).
- **On scroll the signature unwinds into the line** — gracefully, "very, very beautifully", never turning into dots.
- **The line is drawn as you scroll, never pre-drawn.** "It doesn't get drawn while you scroll, it's pre-drawn from the
  middle" was a bug. Its head moves with you; the faster you scroll, the faster it follows (it eases after the scroll
  and catches up faster when you scroll fast).
- **Shape: calm, with character.** Small waves, gentle S-curves, "slowly and tastefully winding a little bit".
  **No loops. No tight or radical turns. No jumping from one edge of the screen to the other.** Built from tangents
  (`tangentPath`), so it has no corners. On phones it winds a little more ("a bit more windy on the mobile view").
- **Path below the flight:** through Ildi's photo, down the open edge beside her expertise, behind the inquiry form,
  between a story and its facts, then a wide turn into a run under the closing signature and up into its B.
- **It ends by writing the signature again,** joined at the B ("fix the signature made by the line to be the original
  signature, just connected by the B"). There is no "Beck To Nature" glowing sign at the end (tried and removed), and
  no second signature in the founder section (removed).
- **Glow is subtle.** "Change the glow of the line to be more subtle, now it looks like one thick line." Core 1.8px
  `#F6E6C2`, glow 6px at 12% opacity (on phones a plain 5px stroke at 9%, no blur filter).
- **Where the line crosses the map dots it covers them completely** (nothing peeks through).
- **The line lights what it reaches** was asked once ("everything slowly lights up, and turns off like a light when you
  scroll back"); the current site instead lets each section rise in as it arrives. Either way: things respond to the
  line, and reverse cleanly on the way back.

## 7. The hero: map, lines, headline

- **A dotted world map, full screen** ("stretch the full extent of the screen"), Europe to America, the continents
  continuing low enough to fill the screen. No city names on the map, no Budapest/Chicago labels in the transition.
- **Three gold lines** ("a bit fewer lines, three"), each flying **from one side to the other like the line at the start
  of the animation** — the line itself travels; no dots riding along it.
- **Every line goes between new places each time** ("always from somewhere else to somewhere else"): a European city to
  an American one, never the same pair twice in a row, never a city another line is using.
- **There is always one line moving.** The three lines run on one cycle, a third of a cycle apart.
- **Motion of a line:** the head draws across fast then slower (expo out), rests, then the tail follows it home
  (slow, fast, slower).
- **Cities glow** only at the ends of a live line; they light at once and **fade out gently** (about 400ms, fast then
  slower). Nothing disappears all at once.
- **On scroll, the lines run on to their end cities** — "not all at once, and gracefully": one after another (the line
  nearest its city first, 260ms apart), each over 1.3s on its own clock (not tied to scroll speed), head first, tail
  following it in. **A run never goes backwards.** Back at the top, the usual flights simply start again.
- **The headline** "Take your products / *to America.*" is the main focus, large, centred, calm. Its words rise in on
  load. On pointer devices, letters catch the light as a line passes over them ("make the text glow as the beam lights
  it up").
- **The pointer warms the map dots** it passes over, and a **small** cursor spotlight follows the pointer over the hero
  only ("put a spotlight anywhere the cursor goes" → "smaller spotlight").
- No scroll icon (removed for the signature), no inquiry button in the hero (removed so the headline is the focus; the
  header has one).
- Not on the hero any more: the logo creature jumping from Europe to the US (removed), the "Trusted by" strip.

## 8. The scroll story

- **The opening flight** (pinned, `--flen` 3.6 screens on desktop, 3.1 on phones): the signature unwinds into the line,
  the line rises to Budapest, the camera closes in fast and settles, rides the line across the Atlantic while three
  statements appear ("One booth." "One week." "A clear answer."), then pulls back slowly over America (slow, fast,
  slower), where the landing sentence arrives and the line drops off to carry on down the page.
- **Below the flight, the page scrolls straight down** while the line draws itself. The zoom-in-and-out journey between
  sections was built and then **removed at the owner's request; don't bring it back**.
- **Sections rise in as they arrive** (headings word by word from behind a mask, then their blocks, each from scale
  0.97 and opacity 0) and go back when scrolled past upwards.
- "Everything should move a bit when scrolling, not everything, but everything that would look good." An interactive
  experience, never a plain website — but never boring and never cluttered with motion.
- **Every page ends with a give:** scroll past the bottom and the end lifts with growing resistance, then springs
  back, so the page reads as ended, not frozen (left to Apple devices' own rubber band there).

## 9. Motion

### The owner's core rule: nothing moves linearly
"It's unnatural and AI-ish for any motion to be linear. Every motion should be exponential: quickly, then slower; or
slow, then fast, then slower." Use `expoOut` (fast then slower) for arrivals and things that close in, and `expoInOut`
(slow, fast, slower) for moves and pull-backs (`lib/fx/util.ts`; CSS `--ease: cubic-bezier(.16,1,.3,1)`). The only
linear things allowed are scroll-linked positions that the scroll itself drives — and even those are smoothed.

### Timing
- **UI feedback under 300ms** (snappy timing). Respond within 400ms or it feels slow (Doherty threshold).
- Presses 150ms ease-out; hovers 150ms; step changes 280ms; dialog in 320–400ms; content reveals 900–1000ms with a
  70ms stagger, total stagger kept short.
- **Exits are about 20% shorter than entrances**; never delay a close.
- **Frequency of use:** the more often something is used, the less it animates. The form's chips get a tiny press;
  the once-per-visit "thank you" gets the celebration.

### The owner's animation rules (2026-11-18), applied everywhere
| Rule | On the site |
| --- | --- |
| Entrances start from scale 0.97 and opacity 0, never from scale 0 | section blocks, the dialog card, the answer trail |
| Buttons scale to 0.97 while pressed, `transition: transform 150ms ease-out` | `.btn:active`, `.chip span:active` |
| Wrong input: shake (translateX 0, −10, 10, −6, 6, −3, 0px over 360ms) **and** turn it red | `.step.shake` + `.step.bad` |
| Steppers slide the next step in from the direction you're going, not a crossfade | `stepIn` / `stepBack` |
| Accordions: `:root { interpolate-size: allow-keywords }` so `height: auto` animates | set on `:root` |
| Animate transform (and opacity), never top or left | skip link, dial, everything |
| Theme switch: `.theme-switching * { transition: none !important }` while switching | (no theme switch yet) |
| Tooltips: delay only the first; once one is open, show the rest instantly | (no tooltips yet) |
| Flicks and drags hand off to a spring that keeps the release velocity (duration ~0.5s, bounce 0) | month dial `spring()` |
| Past either end of a drag or carousel: resistance that grows the further you pull, then spring back | dial `band()`, page end bounce |
| A bounce at the end of every page so it reads as ended, not frozen | `lib/fx/endBounce.ts` |

### The 20 principles of UX and animation (the owner's list, with what they mean here)
1. **Squash and stretch** — things squish on impact and stretch in motion: the selected-answer check pops (0.4 → 1.18 → 1).
2. **Anticipation wind-up** — a small pull back before the big move: the camera's slow start before it pulls back.
3. **Staging the focus** — direct the eye to one thing at a time: one statement at a time in the flight, one question at a time in the form.
4. **Pose to pose** — set key poses and let the browser fill the frames: keyframed flight beats (`T` in `flight.ts`).
5. **Follow through** — parts keep moving after the main body stops, then settle: the line's tail follows its head home.
6. **Slow in and slow out** — never constant speed (see the core rule).
7. **Moving in arcs** — the lines fly on curves, never straight.
8. **Secondary action** — a small flourish backing the main action: cities pulse as a line arrives; the ok-mark on a valid email.
9. **Snappy timing** — UI animations under 300ms.
10. **Exaggerated feedback** — push it past real so the moment lands: confetti and a drawn check when the inquiry is sent.
11. **Solid drawing in 3D** — give flat things depth: the camera's zoom over the map; layers lighter as they rise.
12. **Overall appeal** — the sum of every detail, done with care.
13. **Fitts's law** — bigger, closer targets are faster: the whole dial track drags; chips are full-width, 72–84px tall.
14. **Bigger hit areas** — the clickable area can be bigger than it looks: menu links and footer links get an invisible 8px margin; the small header button keeps a 44px tap area.
15. **Hick's law** — more choices, slower decisions: four answers per question.
16. **Miller's law** — about seven things in mind at once: six questions, chunked one at a time.
17. **Doherty threshold** — respond within 400ms.
18. **Postel's law** — accept messy input, give back clean output: names, emails and phones are trimmed; phone accepts any format.
19. **Jakob's law** — people expect it to work like the apps they already use: native selects, radio semantics, Enter to continue, Esc closes the dialog.
20. **Frequency of use** — the more often, the less it animates.

### 20 ways to make animations beautiful (the owner's second list)
Ease-out for entrances · dropdowns at 150–250ms · stagger list rows by ~30ms · scale to 0.97 on press · stretch moving
knobs ~12% · stagger as details settle · arcs for object movement · pulse to confirm success · ease-in-out for moves ·
start popovers at 0.95 · enter from the trigger · exit to the trigger · no bounce on everyday UI · don't tween while
held · make exits 20% shorter · overlap old and new states · masks for reveals and colour · crossfade icons + blur ·
rubber band past bounds · reuse the same layout id for shared-element moves.

### From the age-picker reel (applied to the month dial)
Fitts's law (the whole width drags) · visual hierarchy (the number is the biggest thing) · Von Restorff (one accent,
only on the needle) · object constancy (numbers slide instead of swapping) · snapping (always settles on a whole
month) · motion blur on the jump between numbers · natural mapping (later rolls one way, sooner the other) · tabular
figures · animate only the digit that changed · inertia (flick it and it glides to a stop) · multimodal feedback
(a short vibration where supported) · visual cue that it is interactive (grab cursor, ruler, needle) · skeuomorphism
(it looks and moves like a real dial, so nobody needs instructions). The dial must work well on iPhone (touch lock to
horizontal, `touch-action: pan-y`).

### From the app-motion reel (the spirit, translated to the web)
Numbers roll rather than swap, every animation around 0.2s; **one big celebration for the biggest moment** (the sent
inquiry: confetti in the brand's colours plus a success vibration); a skeleton instead of a spinner; heavy shaders
paused with Reduce Motion or on low power; haptics that match success and error; buttons that shrink a little when
pressed; a launch state that matches the page so there is no white flash (dark `theme-color`, dark background before
JavaScript); test at the biggest text sizes.

### Motion tokens (transitions.dev / transitions-polish, used as a check)
Durations: stagger 40ms · micro 80ms · quick 150ms (close, text swap) · fast 250ms (open, tabs, page slide) · medium
350ms (panel close) · slow 400ms (panel open, reveal) · very slow 500ms (success check). Scales: modal 0.96, dropdown
0.97, tooltip 0.98. Distances: 4px text swap, 6–8px shake/slide, 12px text reveal; more than ~40px reads sluggish
except for big panels. Blur 2–3px only to soften a swap or slide, never on a plain fade. Open/close asymmetry; overshoot
only on entrances, never on a close; keep total stagger under ~300ms for UI lists.

### Accessibility of motion
`prefers-reduced-motion: reduce` shows the page complete and still (no flight, no reveals, signature written, line
drawn, no grain, no bounce). Nothing essential depends on motion.

## 10. Interaction

- **Feedback the instant a finger lands:** `:active` styles, not click-only changes. No 300ms tap delay
  (`touch-action: manipulation`), no grey tap flash.
- **Hover only on devices that hover:** every `:hover` rule lives in `@media (hover:hover) and (pointer:fine)`.
- **Controls aren't text:** buttons, chips and menu links don't select their label or pop a callout on long-press.
  Content text stays selectable.
- **Focus is visible** (2px cream outline) for keyboard users. Esc closes dialogs. Enter continues the form.
- **In-page links scroll smoothly** and land with the header clear (`scroll-padding-top: 96px`).
- **Settings-style lists** (if the site ever needs one): group rows under titles; show the current value in the row
  ("English"); an arrow means "this row opens a screen"; a risky action (delete account) is red, at the bottom, no arrow.
- **A play button's triangle is nudged slightly right** so it looks centred.

## 11. The inquiry form (the main call to action)

- **The destination of the whole site.** Make it simple so nobody stops filling it in. "We want to make sure that it's
  simple."
- **One question at a time, six steps:** what the company makes → how to reach you → where the product is today →
  US history → when the first show (the month dial) → company and country (a clickable map of Europe, with a native
  select as the alternative). The owner's list: product state, industry, previous tries in the US (drop it if it
  becomes a roadblock).
- **Revolut-style:** every small interaction reduces effort, builds confidence and keeps you moving:
  - picking an answer moves on by itself after a beat (380ms);
  - "Question 1 of 6" and a progress bar of six segments;
  - the answers so far stay visible as a quiet row above the question, each one reopening its question (so nobody goes
    back just to check — "show the current value in the row");
  - a small check appears in a field once what's in it will work;
  - errors explain what to do, in one line, with the shake and red;
  - focus moves to the new step's first field without scrolling the page.
- **Answer cards follow the reference form the owner liked:** large rounded cards with a title and a muted subtitle,
  a round mark top right that fills with a check when chosen; dark inputs with labels above; a hairline above the
  footer; a quiet "Back" and a bright pill "Continue". Not onyx, not black-on-onyx (both tried and reverted).
- **Contact details are saved when the visitor continues past step 2** (the form says so), so the team can follow up
  if they stop ("half-submitted inquiry" — SMS automation is the owner's plan; the form asks for explicit, optional
  consent to texts with the required STOP/HELP wording).
- **Everything goes to an email** (Resend through `/api/inquiry` on a server host). On GitHub Pages there is no server:
  the form ends with "Open in your email app", the answers filled in.
- **The reward:** when it is sent, a premium moment — the check draws itself, confetti in brass and cream, a short
  summary of what they told us, "Our founder will reply personally within [two business days]".
- **No calculator, no AI estimate, no booking widget.** (An "AI calculator" was discussed early and replaced by the
  inquiry.)

## 12. Dark mode and surfaces (summary)
See section 3. Background darkest → card lighter → on-card lighter → sheet lighter still, background dimmed. Never pure
black (`#000`) or pure white text. Shadows can stay but can't separate layers on their own.

## 13. Texture and atmosphere

- **"Less flat" without clutter:** a very fine speckle over the page (`body::after`, an inline SVG noise, 7% opacity, no
  image request), off on touch screens and with reduced motion.
- The owner's list of backgrounds that make designs less flat, for future choices: felt texture, fluted glass, thermal
  gradients, water ripples, speckled graphite (the one we use), single-hue landscapes, blueprint grids, halftone,
  grainy gradients, grass texture, dithered images, paper texture, contour lines, cloud sky, pixel mosaics, lens
  distortion, stippled gradients, square-dot grids (the hero map is one), blurred photos, iridescent shapes,
  impressionist paintings, ASCII and pixels. Use at most one, quietly, and only if it serves the brand.
- **Spotlights, not glows.** Light comes from the line, the cities and a small pointer spotlight on the hero; never
  from glowing cards or buttons ("glowing metallic gold buttons look dated, closer to a casino or crypto site").
- **Stone/onyx:** currently not used. If it ever returns: small, tasteful, only to bring attention to one place, never
  as big blocks or everywhere, never behind small text, slightly blurred if behind anything.

## 14. Mobile (feel native)

From Emil Kowalski's mobile checklist and the owner's iPhone reports:
- `viewport-fit=cover` with safe-area padding on the header and footer; `100svh` for the hero (stable when the address
  bar moves); inputs ≥16px; `theme-color` matches the header (`#121211`); no `user-scalable=no` ever.
- `-webkit-tap-highlight-color: transparent`; `touch-action: manipulation` on links, buttons, answers; `user-select:
  none` and `-webkit-touch-callout: none` on controls only.
- Hover gated behind `(hover:hover) and (pointer:fine)`; press feedback on `:active`.
- **Smoothness first on phones:** no SVG blur filters or full-screen blend layers that repaint every scroll frame; tiny
  canvas dots snap to device pixels so they don't shimmer; animate transform and opacity only.
- **Same composition as the desktop**, simplified, never zoomed down. The month dial must work with a thumb.
- **Test on a real phone.** Emulation does not show sticky hover, tap delay, rubber-banding, safe areas, the keyboard or
  stutter. Say what still needs a real device.

## 15. Brand assets

- **Logo:** the figure (a small person) and the "BECK TO NATURE" wordmark, in cream on the dark site. An inverted icon
  (white figure on the mark) exists in `logo/`.
- **Tab icon:** the gold figure on a black rounded square (`public/logo/favicon-gold.svg`).
- **Icons** (from the owner's reel): ask for many different styles, keep only those that still read at home-screen
  size (60pt); fix anything that disappears when small; finish the favourite by hand and use the same mark everywhere;
  export 1024×1024 without transparency plus dark and tinted versions; offer alternates.
- **Icon set:** one line style, one stroke, taking the colour of its text (the site only needs an arrow).
- **Business card and print** follow the same palette: dark grey, brass cream, EB Garamond, the signature.

## 16. Privacy, legal and third parties

- The site sets **no cookies** and loads **nothing from other companies** (fonts self-hosted). Keep it that way, or
  update `app/cookies/page.tsx` and `app/privacy/page.tsx` in the same change.
- Never commit `.env.local` or any key. Never put the owner's or Ildi's private details on the public site.
- Legal pages: US LLC drafts (North Carolina, Wake County courts as a placeholder), General Legal CC0 templates,
  unreviewed. Keep the "not final" status visible to the team.

## 17. How the owner wants to work

- **Videos, not artifacts,** when they ask to see the site (`node design/tools/record-preview.js`, site on port 3210).
  "The artifact is horrible."
- **Drafts first** when designing something new ("don't start the full website, first make a draft"); then iterate:
  the owner has many opinions and changes ideas — keep things easy to change.
- **Push to GitHub `main`** when a task is done and the build passes; GitHub Pages redeploys in about two minutes
  (https://beqck00.github.io/beck-to-nature-website/). Update `design/HANDOFF.md`.
- **Use the skills.** The owner repeatedly asked to "use every skill you have" — read the relevant ones (section 20)
  before designing, and resolve conflicts in the owner's favour.
- **Answer in the owner's language** (they write in English and sometimes Hungarian).

## 18. Code principles (what the audit of every line taught)

The owner asked for every line to be necessary and as effective as it can be, and for nothing to be hand-built that
the browser already provides. These rules follow from the audit in [references/code-audit.md](references/code-audit.md).

### Use the platform first
Before writing a component, check whether HTML or CSS already does it:
| Need | Built in — use it |
| --- | --- |
| A modal / "thank you" / confirmation | `<dialog>` + `showModal()` (top layer, focus kept inside, Esc closes, `::backdrop`) |
| A list of options | `<select>`; radio inputs for single choice (our chips are styled radios) |
| A date or calendar | `<input type="date">` / `"month"` — never a hand-made calendar |
| Email, phone, number entry | `type="email"`, `type="tel"`, `inputmode`, `autocomplete`, `enterkeyhint`, `autocapitalize`, `spellcheck` |
| A disclosure / accordion | `<details>`/`<summary>` + `interpolate-size: allow-keywords` |
| Smooth in-page scroll with a fixed header | `scroll-padding-top`, `scroll-margin-top`, `scrollIntoView` |
| Stable hero height on phones | `100svh` |
| Hover only on mice | `@media (hover:hover) and (pointer:fine)` |
| Press feedback | `:active` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` |
| Hiding a closed element | `[hidden]`, `<dialog>` closed state |
| Focus ring for keyboards only | `:focus-visible` |
| Lazy work until something is on screen | `IntersectionObserver` |
| Watching size changes | `ResizeObserver` |
| Text balance | `text-wrap: balance` / `pretty` |
Build custom only when the design is the point and the platform can't express it: the hero canvas map, the gold line,
the signature, the month dial (the owner's dial principles), the Europe map picker. Even then, keep native semantics
underneath (the dial is `role="slider"` with arrow keys; the map has a `<select>` beside it).

### Keep only what is used
- When a feature is removed, **remove its code in the same change**: its CSS, its JavaScript, its events, its assets
  (the founder/essay/promise styles, the "light up word by word" helper, a city-label function and a prefill event
  survived their features until this audit).
- No unused files in `public/` — everything there is published. (Unused logo copies and the TTF fonts, 1.9MB, were
  removed; the source logos stay in `logo/`.)
- One rule per thing: no duplicate declarations of the same selector in two places.
- Old drafts (`index.html`, `design/design-system-draft.html`, `design/demo/`) are history and are not part of the site;
  don't build from them.

### Make it cheap to run
- Animate `transform` and `opacity` only. Never `top`, `left`, `width`, `height`, margins or large blurs.
- No allocation in per-frame loops that can be done once (colours and strings are precomputed).
- On touch screens avoid filters and blend modes on large layers.
- Coalesce pointer moves into one `requestAnimationFrame`; pause heavy drawing when it's off screen.
- **Measure, don't guess.** Phone smoothness is checked with a phone-sized browser at 4× CPU slowdown, scrolling the
  whole page and timing every frame (90% of frames should take 16.7ms, none over 50ms). A change that "should" help can
  make it worse: a full-screen canvas composite each frame doubled the slow frames until it was cut to two thin strips.
- Never measure an SVG path (`getPointAtLength`) per frame — measure once into a table when the line is built.
- Never re-apply a CSS mask or filter every frame; draw the effect into the canvas over the smallest area.
- Cache what stands still (the hero's dots are drawn once and reused until the camera moves).
- Ignore resize events that only come from the phone's address bar (same width); rebuilding mid-scroll causes hitches.
- No `will-change` on many elements (each becomes its own layer); only on the few that move continuously.
- Prefer CSS transitions for UI; use JavaScript (and GSAP) only for scroll-driven or physics motion.

### Keep it readable for the next person
- Comments say **why** and **what the owner asked for**, not what the next line does.
- Tokens live once, in `:root`. Easing helpers live once, in `lib/fx/util.ts`.
- Placeholders as `<Ph>[…]</Ph>`. Links and images through `at()` so GitHub Pages' base path works.
- The build must pass (`npm run build`) before every push.

## 19. Before you ship: the checklist

- [ ] Does it lead to the inquiry, or at least not compete with it?
- [ ] "We" voice, professional, short, no hype, no invented facts?
- [ ] Dark grey layers lighter as they rise, one accent, no glows/shadows/gradients on cards, no seams?
- [ ] EB Garamond, body ≥18px, italic at most once or twice per page?
- [ ] No three-card grid, no cards on cards, no big empty gaps, one alignment logic?
- [ ] The line: drawn while scrolling, no loops, no tight turns, subtle glow, covers the dots, ends in the signature?
- [ ] Every motion eased (expo), never linear; UI under 300ms; exits shorter; nothing vanishes at once; nothing runs
      backwards jarringly; reduced motion respected?
- [ ] The owner's animation rules table holds?
- [ ] Phones: same composition, no stutter, no stuck hover, no tap flash, no zoom on inputs, safe areas?
- [ ] Platform first: no hand-made version of something HTML/CSS provides?
- [ ] No dead code, no unused files, no duplicate rules left behind?
- [ ] No cookies, no third-party requests, no keys, no private details?
- [ ] Build passes, pushed to `main`, HANDOFF updated; a video if the owner wants to see it?

## 20. The skills the owner installed, and what each brings

| Skill | Take from it | Where the owner overrides it |
| --- | --- | --- |
| **impeccable** (62 rules against AI slop) | the brief wins; refinement preserves; catch AI tells | — |
| **ui-ux-pro-max** | a persisted design system, accessibility and interaction rules, priorities | the owner's palette and type are fixed |
| **taste-skill** | headlines ≤2 lines; no eyebrows; no index numbers; no gradients; no shadows at rest; no glass; no rows of identical cards; space larger between sections than inside; nothing on top of a headline | the owner keeps one italic accent and hairline row dividers; the gold line may cross text by design |
| **unslop** | 4px grid; one neutral ramp; three text roles; one accent used rarely; quiet hairlines; depth from surface steps on dark; no hype copy; sentence case; remove looping/bouncy motion; transform/opacity only | — |
| **transitions-dev / transitions-polish** | the motion tokens, open/close asymmetry, hover in vs out, stagger limits | the owner's expo easing for scroll motion |
| **GSAP skills** (core, timeline, ScrollTrigger, utils, plugins, react, performance) | scroll-linked timelines, transform-only animation, batching reads/writes, cleanup on unmount | — |
| **Emil Kowalski: mobile-native, emil-design-eng** | the mobile checklist (section 14); invisible details; frequency of use | — |
| **apple-design** | springs that keep velocity, gestures, rubber banding, materials, reduced motion | no glass/materials on this site |
| **find-animation-opportunities** | animate only where frequency and purpose justify it | — |
| **extract-design (designlang)** | pull tokens from a reference site before borrowing from it | — |
| **React Bits** | ready animated components — only if one fits the brand exactly | never as decoration |
| **Playwright CLI** | check every change in a real browser, at desktop and phone sizes, with screenshots | the owner sees videos |
| **legal-templates** (General Legal, CC0) | privacy policy, cookie notice, terms, contracts | drafts until a lawyer reviews |

## 21. References the owner sent (what each one taught)

- **Business & finance icon sheet** (outline and solid pairs): a consistent line-icon style.
- **A dark crypto landing page** (glassy cards, partner logos, FAQ): the monochrome premium mood — but the owner later
  ruled out logo strips, FAQ, pricing and card grids.
- **"Prototype of the site" wireframe** (minimal dark, large thin type, round arrow buttons, rows of projects with
  hairlines): rows instead of cards, generous type, restraint.
- **A dark grey ramp** (#0A0A0A, #161616, #1D1C1C, #232323, #2C2C2C, #363636, #454444): near-black tones that step
  gently — the origin of the dark-grey layers.
- **Neue Montreal** specimen: a clean grotesque as a typographic reference (the site uses EB Garamond).
- **Silver palette**, **brushed brass**, **rose gold** swatches: the metal accents tried; brass chosen.
- **"Anatomy of a high-converting SaaS landing page"**: the section checklist the owner then trimmed to their own.
- **Candle onyx photo**: the stone texture (used, then removed).
- **Line drawings** (a blue path down the page): a calm, winding line with no loops or sharp turns.
- **A dark "Create card" dialog**: the model for the form's answer cards, fields and footer.
- **"20 principles of UX & animation", "22 backgrounds", "20 ways to make beautiful AI animations", "Robot vs Pro"
  speed comparison** (linear vs eased movement): the motion and texture lists above.
- **Dark-mode layers video** (#000 background, #161618 cards, #232326 sheet): elevation by colour.
- **Settings-screen lesson**: sections, values in rows, arrows, a red delete at the bottom.
- **Revolut form breakdown**: forms that feel enjoyable — reduce effort, build confidence, keep moving.
