# Code audit (2026-11-19)

The owner asked for every line of the website's code to be checked: is it needed, was it already built (by us or by
the browser), and is it the most effective way to do it. This is the result, file by file. The rules that came out of
it are in `SKILL.md`, section 18. Re-run the checks at the end of this file after any large change.

## What was removed or replaced

| Where | What | Why |
| --- | --- | --- |
| `app/globals.css` | `.founder`, `.founder-text`, `.f-name`, `.f-role`, `.f-quote`, `.essay*`, `.promise*`, `.f-links*` (20 rules) | The founder section they styled was replaced by the Ildi section; nothing used them |
| `app/globals.css` | `.ok`, `.ok svg` | The specialty tier cards they styled were removed |
| `app/globals.css` | `.btn-ghost` and its hover, `.sr`, `.sec-head.center` | Never used |
| `app/globals.css` | `.flight{position:relative}` | Already set by `.flight,.scene{…}` |
| `app/globals.css` | The second `.btn` transition block and the second `.chip span` transition | The same selectors were declared twice; merged into one rule each (the values the owner's animation rules set) |
| `app/globals.css` | `transform:scaleX(var(--rule))` on story dividers | `--rule` was set by a scroll script that no longer exists |
| `lib/fx/util.ts` | The "light" mode of `splitWords` (`.lw`) | Words lighting up one by one was removed with the old scenes; only "rise" is used |
| `lib/fx/flight.ts` | `place()` | Positioned the Budapest/Chicago labels the owner asked to remove |
| `lib/fx/flight.ts` | `cities` (all nine cities mapped on every layout) | Only Budapest and Chicago were read; now mapped directly |
| `lib/fx/flight.ts` | A second copy of the quadratic-curve formula | Shared as `quad()` in `util.ts` |
| `lib/fx/flight.ts` | `mix(DOT, DOT, 0)` built twice per frame | Precomputed once (`DOT_FILL`, `NEAR_FILL`) |
| `lib/fx/flight.ts` | A quadratic ease for the signature writing itself | The owner's rule is exponential easing: now `expoInOut` |
| `lib/fx/flight.ts` | A stale comment saying the lines run into the signature | That behaviour was replaced the same day |
| `components/Experience.tsx`, `components/Inquiry.tsx` | The `btn:prefill` event (dispatch and listener) | It let the old industry cards fill in question 1; no element triggers it any more |
| `components/Inquiry.tsx` | A `<div role="dialog">` rendered into `document.body` with `createPortal` | Replaced by the browser's own `<dialog>` + `showModal()`: top layer without a portal, focus kept inside, Esc closes it, `::backdrop` built in |
| `components/Inquiry.tsx` | Class `card` on the form and the dialog card | No CSS used it |
| `public/fonts/eb-garamond/*.ttf` (1.5MB) | Unused copies of the font | `next/font` serves the woff2 files in `app/fonts/`; everything in `public/` is published, so unused files cost visitors and the repo. The licence moved to `app/fonts/OFL.txt` beside the fonts it covers |
| `public/logo/beck-to-nature-*` (13 files, 0.6MB) | Unused copies of the logos | The site uses only `figure-cream.svg`, `wordmark-cream.svg` and `favicon-gold.svg`; the source logos stay in `logo/` |

## What was added because the browser already provides it

| Where | What |
| --- | --- |
| Inquiry fields | `autocapitalize="words"` on the name; `autocapitalize="none"`, `autocorrect="off"`, `spellcheck={false}` on the email; `enterkeyhint="next"`/`"done"` so the phone keyboard's return key says what it does |
| The dialog | `onCancel` (Esc) closes it with the same fade as the button; `.reward[open]` shows it, the browser hides it when closed |
| The dialog's quiet button | lighter than the sheet it sits on (elevation rule) |

## File by file: what each part is for, and the verdict

### `app/layout.tsx` (34 lines) — needed
Fonts (`next/font/local`, self-hosted), metadata, the tab icon, the viewport (`viewport-fit=cover`, dark `theme-color`),
a tiny script that adds `fx` before first paint (so nothing flashes), and the end-of-page bounce. All used.

### `app/page.tsx` (142 lines) — needed
The page's content and structure. Content arrays (`DEPTH`, `STORIES`) keep the markup short. The inline SVG `cityglow`
gradient is used by both lines' heads. Sections carry `data-r` for the reveal. Verdict: lean.

### `app/globals.css` (≈350 lines after the audit) — needed, now without dead rules
Tokens in `:root`; one rule per component; hover gated for real hover devices; reduced-motion handled once; mobile
rules at the end. `interpolate-size` is set for future accordions. Kept deliberately: `.hp` (spam honeypot), `.callout`
and `.tbl` (legal pages), `.reward*` (the dialog), the dial and Europe-map rules.

### `components/Experience.tsx` (≈108 lines) — needed
One `requestAnimationFrame` loop drives both the flight and the line, smoothed after the scroll (faster when the
visitor scrolls faster, as the owner asked). Handles in-page links (the "why" link needs a computed position inside
the pinned flight, so plain anchors can't do it), the hero spotlight (pointer devices only), resize and font loading,
and the still version for reduced motion.

### `lib/fx/flight.ts` (≈420 lines) — needed; the largest file because the hero is the brand's centrepiece
Canvas dotted map with heat, the three hero lines and their scheduling, the main line's geometry, the camera, the
signature, the scroll-linked headline/statements timeline (GSAP), and the comet light on the headline. Custom by
necessity: no built-in element draws this.

### `lib/fx/thread.ts` (127 lines) — needed
The line down the page (tangent path through the sections), drawing it to the scroll, the closing signature, and the
section reveals (one `IntersectionObserver` instead of a scroll library).

### `lib/fx/util.ts` (≈100 lines) — needed
Shared maths: clamp, lerp, smoothstep, the exponential easings, `quad`, path builders, the dash window, stroke
builder, the word splitter. Each function is used.

### `lib/fx/endBounce.ts` + `components/EndBounce.tsx` — needed
The owner's "bounce at the end of every page". There is no CSS for overscroll on desktop browsers, so it is a small
script; Apple devices keep their native rubber band (it is skipped there), and reduced motion turns it off.

### `components/Inquiry.tsx` (≈250 lines) — needed
Six steps, auto-advance, validation with shake and red, the answer trail, the dial step, the Europe map with a native
`<select>` beside it, partial submit, the native `<dialog>` reward with confetti and the mailto fallback. Native
elements are used wherever they fit: radios for answers, `<select>` for country, typed inputs, `<dialog>`, `role="slider"`
semantics on the dial.

### `lib/dial.ts` (126 lines) — needed (the owner's dial)
A native range input could pick a month, but the owner asked for this dial and its principles (rolling tabular
digits, snapping, inertia, rubber band, a spring that keeps the release speed). It keeps native semantics (`slider`,
arrow keys, `aria-valuetext`).

### `lib/inquiry.ts`, `lib/send-inquiry.ts`, `app/api/inquiry/route.ts` — needed for a server host
Questions and the validated shape (zod, used by the server route); email through Resend; a small rate limit and a
honeypot. GitHub Pages has no server, so the Pages build removes `app/api` and the form ends with the email-app
fallback (`STATIC_HOST`). Kept so the site can move to a host that sends the form directly.

### `lib/base.ts`, `next.config.ts`, `.github/workflows/pages.yml` — needed
GitHub Pages serves the site under `/beck-to-nature-website`; `at()` adds that base path to links and images.

### `lib/data/*.ts` — needed
The world dots, the Europe outlines and the signature strokes, as compact data.

### `components/LegalPage.tsx`, `app/privacy`, `app/terms`, `app/cookies` — needed
Shared legal layout and the three drafts. Unreviewed by a lawyer.

### `components/Ph.tsx` — needed
The placeholder convention.

## Not part of the website (history and tools)
`index.html`, `design/design-system-draft.html`, `design/demo/`, `design/tools/demo-build/`,
`design/tools/make-onyx-texture.py`, `design/colour-palette.html`, `higgsfield-prompts.md`, `logo/` (source logos).
These are not built into the site. They are kept as history and sources; the owner can ask for them to be deleted.

## How to re-run the checks
- **Unused CSS classes:** list every `.class` in `app/globals.css` and search for it in `app/`, `components/`, `lib/`
  (a word match that isn't in a comment). Anything with no match is dead.
- **Unused exports:** for each `export` in `lib/` and `components/`, search for its name in the other files.
- **Unused public files:** for each file in `public/`, search its path in `app/`, `components/`, `lib/`, `.github/`.
- **Duplicates:** search `app/globals.css` for a selector that starts more than one rule.
- **Behaviour:** build (`npm run build`), start on port 3210, then in a browser: the hero, a scroll through the flight,
  the form from first question to the dialog (Esc closes it), the end-of-page bounce, at 1280×720 and on an
  iPhone-sized screen, with no console errors.
