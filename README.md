# Beck To Nature website

Next.js 16 with GSAP for the scroll experience. Live at https://beqck00.github.io/beck-to-nature-website/ (GitHub Pages, published on every push to `main`). Read `design/HANDOFF.md` for the current state and what is left to do.

## Run it locally

1. Install [Node.js 20 or newer](https://nodejs.org) and Git.
2. Clone the repo and install:
   ```bash
   git clone <repo URL>
   cd beck-to-nature-website
   npm install
   ```
3. `npm run dev`, then open http://localhost:3000.

The inquiry form emails the team through [Resend](https://resend.com). To try that locally, create `.env.local` (never committed) with `RESEND_API_KEY`, `INQUIRY_FROM` and optionally `INQUIRY_TO`; see `design/HANDOFF.md`. Without them the form works but ends by offering to open the visitor's email app instead.

## Working together

We take turns rather than working at the same time, so everyone works directly on `main`:

- **Before you start:** `git pull`
- **When you stop:** `git add -A`, `git commit -m "what you changed"`, `git push`

Claude Code sessions do the pull automatically when they start (see `.claude/settings.json`) and are told in `CLAUDE.md` to commit and push when a task is done.

## Layout

- `app/page.tsx`: page content. `app/globals.css`: all styles.
- `components/Experience.tsx`, `lib/fx/`: the scroll experience (opening flight, the gold line, section animations).
- `components/Inquiry.tsx`, `lib/inquiry.ts`, `lib/dial.ts`, `app/api/inquiry/`: the inquiry form and its server route.
- `app/privacy`, `app/cookies`, `app/terms`: legal pages (drafts for a US LLC).
- `lib/data/`: the dotted world map, Europe outlines and the signature strokes.
- `public/`: logo files and the onyx texture. `app/fonts/`: EB Garamond.
- `design/`: handoff notes, the earlier demo, colour palette, textures, and the tools used to make them.
- `index.html`, `logo/`, `higgsfield-prompts.md`: the original draft and source assets.
