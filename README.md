# Beck To Nature website

Next.js 16 + Motion. The US readiness check calls Claude through the server route in `app/api/readiness/route.ts`.

## Run it locally

1. Install [Node.js 20 or newer](https://nodejs.org) and Git.
2. Clone the repo and install:
   ```bash
   git clone <repo URL>
   cd beck-to-nature-website
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and put an Anthropic API key in it. This file is never committed; everyone needs their own copy.
4. `npm run dev`, then open http://localhost:3000.

Without a key the site works, but the live readiness check shows "isn't available right now". "See an example result" always works.

## Working together

We take turns rather than working at the same time, so everyone works directly on `main`:

- **Before you start:** `git pull`
- **When you stop:** `git add -A`, `git commit -m "what you changed"`, `git push`

Claude Code sessions do the pull automatically when they start (see `.claude/settings.json`) and are told in `CLAUDE.md` to commit and push when a task is done.

## Layout

- `app/page.tsx`: page content
- `app/globals.css`: all styles (from the original draft)
- `components/`: nav, photo slots, FAQ, copy buttons, readiness check wizard
- `lib/readiness.ts`: readiness check types, schema and the example result
- `public/logo/`: logo files used by the site
- `index.html`, `logo/`, `higgsfield-prompts.md`: the original draft and source assets
