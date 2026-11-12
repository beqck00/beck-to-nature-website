# Beck To Nature website

Three people take turns working on this repo, each with their own Claude account. The repo on GitHub is the shared source of truth.

- At the start of a session, make sure the checkout is up to date with `origin/main` (a SessionStart hook runs `git pull --ff-only`; if it failed, say so and pull before editing).
- Work directly on `main`. When a task is finished and the build passes (`npm run build`), commit with a clear message and `git push`, so the next person picks it up. Don't leave finished work uncommitted.
- Never commit `.env.local` or any API key.
- Placeholder text the owners still need to fill in is wrapped in `<Ph>[...]</Ph>` in `app/page.tsx` (and in the legal pages); keep that convention.
- **Read `design/HANDOFF.md` first.** It says what is built, what is still unchecked or to do, the owner's standing design decisions, and the open legal questions. Update it when you finish a piece of work.
- The redesign is built: black with brass and cream, EB Garamond, no onyx, short text, and a scroll-driven story: an opening flight, then a journey in which the gold line strays from section to section and the camera follows it sideways. Keep it uncluttered (no glows, shadows or gradients on cards) and keep the gold line free of tight turns. Styles live in `app/globals.css`; the scroll code is in `components/Experience.tsx` and `lib/fx/` (`flight.ts`, `journey.ts`). Match this look rather than introducing a new one. The older drafts (`index.html`, `design/design-system-draft.html`, `design/demo/`) are history.
- The site sets no cookies and loads nothing from other companies (fonts are served from `app/fonts/`). Keep it that way, or update `app/cookies/page.tsx` and `app/privacy/page.tsx` in the same change.
- The legal pages are drafts for a US LLC and have not been reviewed by a lawyer. Do not present them as final.
