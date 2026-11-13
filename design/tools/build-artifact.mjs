// Builds a self-contained copy of the site for publishing as a Claude artifact (or any static host):
//   design/artifact/index.html       the home page: inline styles, fonts and logos, one inline script
//   design/artifact/privacy.html, cookies.html, terms.html   the legal pages
// The form cannot send from a static copy, so it ends with the "open in your email app" step.
// usage: npm run build && node design/tools/build-artifact.mjs
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const NEXT = path.join(ROOT, ".next"), OUT = path.join(ROOT, "design", "artifact");
fs.mkdirSync(OUT, { recursive: true });
const read = (p) => fs.readFileSync(p, "utf8");
const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString("base64")}`;

// the stylesheet, with fonts and images inlined
const page = (name) => read(path.join(NEXT, "server", "app", `${name}.html`));
const home = page("index");
const cssHref = [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
let css = cssHref.map((h) => read(path.join(NEXT, h.replace(/^\/_next\//, "")))).join("\n");
css = css.replace(/url\((["']?)(?:\/_next\/static|\.\.)\/media\/([^)"']+)\1\)/g, (_, q, f) => `url(${dataUri(path.join(NEXT, "static", "media", f), "font/woff2")})`);
const logos = (html) => html.replace(/src="\/logo\/([^"]+\.svg)"/g, (_, f) => `src="${dataUri(path.join(ROOT, "public", "logo", f), "image/svg+xml")}"`);
const htmlClass = (home.match(/<html[^>]*class="([^"]+)"/) || [])[1] || "";

// keep the body, drop Next's scripts, point legal links at the copied pages
function body(html) {
  let b = html.slice(html.indexOf("<body"), html.lastIndexOf("</body>"));
  b = b.replace(/^<body[^>]*>/, "");
  b = b.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<link\b[^>]*>/g, "");
  b = b.replace(/<!--\$-->|<!--\/\$-->|<!-- -->/g, "");
  b = b.replace(/href="\/(privacy|cookies|terms)(#[^"]*)?"/g, (_, p, h) => `href="${p}.html${h || ""}"`).replace(/href="\/"/g, 'href="index.html"');
  return logos(b);
}
const boot = `document.documentElement.classList.add(${JSON.stringify(htmlClass)},"js");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("fx");`;

// the client code: the same Experience and Inquiry components, bundled with React
const js = (await build({
  entryPoints: [path.join(ROOT, "design", "tools", "artifact", "entry.tsx")], bundle: true, minify: true, write: false, format: "iife",
  jsx: "automatic", target: "es2020", alias: { "@": ROOT }, define: { "process.env.NODE_ENV": '"production"' }, logLevel: "warning",
})).outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

// home: replace the server-rendered form with a mount point for the live one
let hb = body(home);
const f0 = hb.indexOf('<form class="card wiz"'), f1 = hb.indexOf("</form>", f0) + 7;
hb = hb.slice(0, f0) + '<div id="iq-mount"></div>' + hb.slice(f1);
const head = (title) => `<title>${title}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<meta name="description" content="Beck To Nature takes Central European manufacturers to US trade shows.">\n<script>${boot}</script>\n<style>${css}\nbody{background:#0A0A0A}</style>\n`;
fs.writeFileSync(path.join(OUT, "index.html"), head("Beck To Nature") + hb + `\n<script>${js}</script>\n`);

// legal pages are separate files, served without the artifact's wrapper, so they carry their own document
for (const [name, title] of [["privacy", "Privacy policy"], ["cookies", "Cookie notice"], ["terms", "Terms of use"]]) {
  fs.writeFileSync(path.join(OUT, `${name}.html`), `<!doctype html><html lang="en" class="${htmlClass}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">${head(`${title} · Beck To Nature`)}</head><body>${body(page(name))}</body></html>`);
}
for (const f of fs.readdirSync(OUT)) console.log(f, Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + " KB");
