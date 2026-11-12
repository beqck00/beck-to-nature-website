import type { Metadata } from "next";
import LegalPage, { LEGAL_NAME, LEGAL_STATE, Mail, Ph, SITE } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookie notice · Beck To Nature", description: "Beck To Nature's website does not use cookies or tracking technologies." };

// Adapted from General Legal's "Cookie Notice" template. The Site sets no cookies, uses no browser storage, analytics,
// pixels or third-party scripts, and serves its own fonts (checked in app/, components/ and lib/). If that changes,
// update the table and add a consent banner for anything that is not strictly necessary.
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
        This cookie notice explains how {LEGAL_NAME}, a {LEGAL_STATE} limited liability company (&ldquo;<b>Beck To Nature</b>&rdquo;, &ldquo;<b>we</b>&rdquo;
        or &ldquo;<b>us</b>&rdquo;), uses cookies and similar technologies on {SITE} (the &ldquo;<b>Site</b>&rdquo;).
      </p>
      <p className="callout">
        <b>In short: the Site does not use cookies or any similar tracking technology.</b> There is no analytics, no advertising and no social media tracking,
        so there is nothing to accept or reject.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small data files that a website places on your computer or phone when you visit it. They can help a site work, remember your preferences,
        or show how the site is used. Session cookies are deleted when you close your browser; persistent cookies stay until they expire or you delete them.
        First-party cookies are set by the site you visit, and third-party cookies are set by other companies, such as analytics or advertising providers.
      </p>

      <h2>Which cookies do we use?</h2>
      <div className="tbl">
        <table>
          <thead><tr><th>Type</th><th>What it is for</th><th>Used on the Site?</th></tr></thead>
          <tbody>{ROWS.map(([type, what]) => <tr key={type}><td>{type}</td><td>{what}</td><td>No</td></tr>)}</tbody>
        </table>
      </div>

      <h2>Other technologies</h2>
      <p>
        We also do not use similar technologies: no browser storage (such as localStorage), no web beacons or tracking pixels, no session-recording tools and
        no third-party scripts. Fonts and images are served from our own website, so your browser is not sent to another company to load them.
      </p>
      <p>
        Like every website, the Site&rsquo;s hosting provider receives basic technical information, such as your IP address, when your browser requests a
        page. That is not a cookie. Our <a href="/privacy">privacy policy</a> explains how this information is handled.
      </p>

      <h2>Your choices</h2>
      <p>
        Because the Site sets no cookies, you do not need to change anything. Most browsers also let you block or delete cookies in their settings, which you
        can do for any website. Your browser&rsquo;s help pages explain how.
      </p>

      <h2>Changes</h2>
      <p>
        If we ever add cookies or similar technologies, we will update this notice first and ask for your consent before setting anything that is not
        strictly necessary.
      </p>

      <h2>Questions</h2>
      <p>If you have questions about this notice, write to <Mail />.</p>
    </LegalPage>
  );
}
