import type { Metadata } from "next";
import LegalPage, { Ph } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie notice · Beck To Nature",
  description: "Beck To Nature's website does not use cookies or tracking technologies.",
};

// Adapted from General Legal's "Cookie Notice" template. The Site currently sets no cookies, uses no browser storage,
// analytics, pixels or third-party scripts (checked in app/ and components/). If that changes, update the table and
// add a consent banner for anything that is not strictly necessary.
const EMAIL = "hello@becktonature.com";

const ROWS = [
  ["Essential", "Needed for the technical operation of a website, for example to keep you signed in."],
  ["Functionality", "Remember your choices, such as language or region."],
  ["Analytics", "Help a site owner understand how visitors use the site, sometimes together with tracking pixels in emails."],
  ["Advertising", "Used by advertising companies to show you ads based on your browsing across sites."],
  ["Social media", "Let you share content or sign in through a social network, and may also be used for advertising."],
];

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie notice" updated={<Ph>[date]</Ph>}>
      <p>
        This cookie notice explains how <Ph>[Full legal name, e.g. Beck To Nature Kft.]</Ph> (&ldquo;<b>Beck To Nature</b>&rdquo;, &ldquo;<b>we</b>&rdquo;
        or &ldquo;<b>us</b>&rdquo;) uses cookies and similar technologies on <Ph>[becktonature.com]</Ph> (the &ldquo;<b>Site</b>&rdquo;).
      </p>
      <p className="legal-callout">
        <b>In short: the Site does not use cookies or any similar tracking technology.</b> There is no analytics, no advertising and no social media
        tracking, so there is nothing to accept or reject.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small data files that a website places on your computer or phone when you visit it. They can help a site work, remember your
        preferences, or show how the site is used. Session cookies are deleted when you close your browser; persistent cookies stay until they expire or
        you delete them. First-party cookies are set by the site you visit, and third-party cookies are set by other companies, such as analytics or
        advertising providers.
      </p>

      <h2>Which cookies do we use?</h2>
      <div className="legal-table">
        <table>
          <thead><tr><th>Type</th><th>What it is for</th><th>Used on the Site?</th></tr></thead>
          <tbody>
            {ROWS.map(([type, what]) => <tr key={type}><td>{type}</td><td>{what}</td><td>No</td></tr>)}
          </tbody>
        </table>
      </div>

      <h2>Other technologies</h2>
      <p>
        We also do not use similar technologies: no browser storage (such as localStorage), no web beacons or tracking pixels, no session-recording tools,
        and no third-party scripts. Images are served from our own website, and text uses your device&rsquo;s built-in fonts.
      </p>
      <p>
        Like every website, the Site&rsquo;s hosting provider receives basic technical information, such as your IP address, when your browser requests a
        page. This is not a cookie. Our <a href="/privacy">privacy policy</a> explains how this information is handled.
      </p>

      <h2>Your choices</h2>
      <p>
        Because the Site sets no cookies, you do not need to change anything. Most browsers also let you block or delete cookies in their settings, which
        you can do for any website. Your browser&rsquo;s help pages explain how.
      </p>

      <h2>Changes</h2>
      <p>
        If we ever add cookies or similar technologies, we will update this notice first and ask for your consent before setting any cookie that is not
        strictly necessary.
      </p>

      <h2>Questions</h2>
      <p>If you have questions about this notice, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
    </LegalPage>
  );
}
