// Shared layout for the legal pages (privacy policy, cookie notice, terms of use), in the site's dark style.
// Drafted from General Legal's CC0 templates (see .claude/skills/legal-templates) and adapted for a U.S. LLC.
import { Ph } from "./Ph";

export { Ph };
export const LEGAL_NAME = <Ph>[Beck To Nature LLC]</Ph>;
export const LEGAL_STATE = <Ph>[Wisconsin]</Ph>;
export const SITE = <Ph>[becktonature.com]</Ph>;
export const EMAIL = "hello@becktonature.com";
export const Mail = () => <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;

export default function LegalPage({ title, updated, children }: { title: string; updated: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="legal-page">
      <header className="legal-top">
        <div className="legal-top-in">
          <a className="brand" href="/" aria-label="Beck To Nature, home">
            <img className="fig" src="/logo/figure-cream.svg" alt="" width="22" height="27" /><img className="wm" src="/logo/wordmark-cream.svg" alt="" width="67" height="32" />
          </a>
          <nav aria-label="Site"><a href="/">Back to the site</a></nav>
        </div>
      </header>
      <main className="legal-doc">
        <p className="eyebrow">Website policy</p>
        <h1>{title}</h1>
        <p className="updated">Last updated: {updated}</p>
        {children}
        <p className="credit">
          This page is adapted from a template prepared and made publicly available by General Legal, PC (&ldquo;General Legal&rdquo;) under CC0. The template is
          provided for general reference only and is not legal advice. Use of the template does not create an attorney-client relationship with General Legal,
          and General Legal has not reviewed, and takes no position on, any changes made to it.
        </p>
      </main>
      <footer className="legal-foot">
        <div className="foot">
          <span>© 2026 Beck To Nature · <Ph>[Hartland, Wisconsin]</Ph> · Budapest · {EMAIL}</span>
          <nav aria-label="Legal"><a href="/privacy">Privacy policy</a><a href="/cookies">Cookie notice</a><a href="/terms">Terms</a></nav>
        </div>
      </footer>
    </div>
  );
}
