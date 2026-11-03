# Beck To Nature website

Three people take turns working on this repo, each with their own Claude account. The repo on GitHub is the shared source of truth.

- At the start of a session, make sure the checkout is up to date with `origin/main` (a SessionStart hook runs `git pull --ff-only`; if it failed, say so and pull before editing).
- Work directly on `main`. When a task is finished and the build passes (`npm run build`), commit with a clear message and `git push`, so the next person picks it up. Don't leave finished work uncommitted.
- Never commit `.env.local` or any API key.
- Placeholder text the owners still need to fill in is wrapped in `<Ph>[...]</Ph>` in `app/page.tsx`; keep that convention.
- Styles live in `app/globals.css` and follow the original draft (`index.html`); match its look rather than introducing a new design.
- A redesign is approved but not built yet: black with brushed brass, solid tone-on-tone panels (no glass) and soft spotlights. The approved draft and its design system are in `design/design-system-draft.html`; when the redesign is built, it replaces the line above.
