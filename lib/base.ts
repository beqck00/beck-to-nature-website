// Where the site lives. Empty on a normal host; "/beck-to-nature-website" when it is built for GitHub Pages
// (see next.config.ts). Wrap every root-relative link or image path in at(), e.g. at("/privacy").
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const at = (path: string) => `${BASE}${path}`;
/** True on a static host (GitHub Pages), where there is no server to send the inquiry form to. */
export const STATIC_HOST = process.env.NEXT_PUBLIC_STATIC === "1";
