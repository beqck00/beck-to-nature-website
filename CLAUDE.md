# Beck To Nature website

Three people take turns working on this repo, each with their own Claude account. The repo on GitHub is the shared source of truth.

- At the start of a session, make sure the checkout is up to date with `origin/main` (a SessionStart hook runs `git pull --ff-only`; if it failed, say so and pull before editing).
- Work directly on `main`. When a task is finished and the build passes (`npm run build`), commit with a clear message and `git push`, so the next person picks it up. Don't leave finished work uncommitted.
- Never commit `.env.local` or any API key.
- Placeholder text the owners still need to fill in is wrapped in `<Ph>[...]</Ph>` in `app/page.tsx` (and in the legal pages); keep that convention.
- **Read `.claude/skills/design-principles/SKILL.md` before designing, animating, writing copy or coding.** It holds every design principle the owner has taught (their own words are in its `references/owner-words.md`) and the code rules from the line-by-line audit (`references/code-audit.md`): use what the browser already provides, and leave no unused code or files.
- **Read `design/HANDOFF.md` first.** It says what is built, what is still unchecked or to do, the owner's standing design decisions, and the open legal questions. Update it when you finish a piece of work.
- The redesign is built: black with brass and cream, EB Garamond, no onyx, short text, and a scroll-driven story: an opening flight, then an ordinary page that scrolls straight down while the gold line draws itself down it (the zoom-between-sections journey was removed at the owner's request on 2026-11-18; don't bring it back). Keep it uncluttered (no glows, shadows or gradients on cards) and keep the gold line free of tight turns. Styles live in `app/globals.css`; the scroll code is in `components/Experience.tsx` and `lib/fx/` (`flight.ts`, `thread.ts`). Match this look rather than introducing a new one. The older drafts (`index.html`, `design/design-system-draft.html`, `design/demo/`) are history.
- The site sets no cookies and loads nothing from other companies (fonts are served from `app/fonts/`). Keep it that way, or update `app/cookies/page.tsx` and `app/privacy/page.tsx` in the same change.
- **When the owner asks to see the site, send a video, not an artifact.** Build, start the site on port 3210 and run `node design/tools/record-preview.js` (it writes `design/preview/`), then send the two recordings. The owner did not like the site as an artifact; don't make one unless asked.
- Dark mode is dark grey, not pure black (`--k1` #121211); a layer that sits higher is lighter (page, then cards, then what is on a card, then sheets), because shadows do not separate layers on a dark field. Animation rules the owner gave on 2026-11-18 are listed in `design/HANDOFF.md` ("Animation rules").
- Every motion eases (fast then slower, or slow, fast, slower), never linear; UI feedback stays under 300ms. See "What the owner taught" in `design/HANDOFF.md` before designing anything.
- The legal pages are drafts for a US LLC and have not been reviewed by a lawyer. Do not present them as final.
