// Shared layout for the legal pages (privacy policy, cookie notice, terms of use).
// Drafted from General Legal's CC0 templates; see .claude/skills/legal-templates.

export const Ph = ({ children }: { children: React.ReactNode }) => <span className="ph">{children}</span>;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie notice" },
  { href: "/terms", label: "Terms of use" },
];

export default function LegalPage({ title, updated, children }: { title: string; updated: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <header className="legal-top">
        <div className="wrap legal-top-inner">
          <a className="logo" href="/" aria-label="Beck To Nature, home">
            <img className="mark" src="/logo/beck-to-nature-icon.svg" alt="" />
            <img className="wordmark" src="/logo/beck-to-nature-wordmark.svg" alt="" />
          </a>
          <a className="legal-back" href="/">Back to the site</a>
        </div>
      </header>
      <main className="legal">
        <article className="wrap legal-body">
          <h1>{title}</h1>
          <p className="legal-updated">Last updated: {updated}</p>
          {children}
          <p className="legal-credit">
            This page is adapted from a template prepared and made publicly available by General Legal, PC (&ldquo;General Legal&rdquo;) under CC0.
            The template is provided for general reference only and is not legal advice. Use of the template does not create an attorney-client
            relationship with General Legal, and General Legal has not reviewed, and takes no position on, any changes made to it.
          </p>
        </article>
      </main>
      <footer>
        <div className="wrap foot">
          <span>© 2026 Beck To Nature · Budapest · <Ph>[Hartland, Wisconsin]</Ph></span>
          <nav className="foot-links" aria-label="Legal">
            {LEGAL_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
        </div>
      </footer>
    </>
  );
}
