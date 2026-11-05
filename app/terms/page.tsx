import type { Metadata } from "next";
import LegalPage, { Ph } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use · Beck To Nature",
  description: "The terms that apply when you use Beck To Nature's website.",
};

// Adapted from General Legal's "Website Terms of Use" template. Left out because the Site does not have them: accounts,
// user-to-user features and the U.S. arbitration clauses (Options A and B). Arbitration and class-action waivers are
// U.S. tools that often cannot be enforced against European users; governing law and courts are placeholders for a
// lawyer to decide (Hungary or Wisconsin).
const EMAIL = "hello@becktonature.com";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated={<>Version 1.0, <Ph>[date]</Ph></>}>
      <p>
        The website at <Ph>[becktonature.com]</Ph> (the &ldquo;<b>Site</b>&rdquo;) is owned and operated by <Ph>[Full legal name, e.g. Beck To Nature
        Kft.]</Ph> (&ldquo;<b>Beck To Nature</b>&rdquo;, &ldquo;<b>we</b>&rdquo;, &ldquo;<b>us</b>&rdquo; or &ldquo;<b>our</b>&rdquo;). These terms of
        use (the &ldquo;<b>Terms</b>&rdquo;) govern your use of the Site. By using the Site, you agree to these Terms on behalf of yourself or the company
        you represent, and you confirm that you have the authority to do so. You must be at least 18 years old to use the Site. If you do not agree,
        please do not use the Site.
      </p>
      <p>
        These Terms cover the Site only. If you hire us, our services are governed by the separate written agreement we sign with you.
      </p>

      <h2>1. Using the Site</h2>
      <p>
        <b>Permission.</b> We give you a limited, non-exclusive, non-transferable and revocable permission to use the Site to learn about our services and to
        get in touch with us.
      </p>
      <p>
        <b>Restrictions.</b> You may not: (i) sell, license or otherwise commercially exploit the Site or its content; (ii) copy, modify, reverse-engineer or
        create derivative works from any part of the Site, except as the law allows; (iii) use the Site to build a similar or competing service; (iv) use
        automated means to scrape the Site or to submit the readiness check in bulk; or (v) interfere with the Site&rsquo;s security or operation. Copyright
        and other notices must be kept on any copy you are allowed to make.
      </p>
      <p>
        <b>Changes to the Site.</b> We may change, suspend or discontinue the Site, or any part of it, at any time.
      </p>

      <h2>2. The readiness check</h2>
      <p>
        The readiness check produces an automated assessment using artificial intelligence, based only on the answers you give. It is general, indicative
        information to help you think about the U.S. market. It is not legal, regulatory, financial or business advice, it may contain errors, and it is not
        an offer or a quote. Price ranges are estimates only. Trade show names and dates should be checked with the organisers, and regulatory
        requirements (for example FDA or UL) should be confirmed with a qualified specialist. Please do not rely on it as the sole basis for a decision.
      </p>

      <h2>3. Ownership and feedback</h2>
      <p>
        The Site and its content, including text, design, logos and images, belong to Beck To Nature or its licensors and are protected by intellectual
        property laws. These Terms do not give you any ownership rights. If you send us feedback or suggestions about the Site, we may use them freely and
        without any obligation to you. Please do not send us anything you consider confidential through the Site.
      </p>

      <h2>4. Privacy</h2>
      <p>
        Our <a href="/privacy">privacy policy</a> explains how we handle personal information, and our <a href="/cookies">cookie notice</a> explains our
        use of cookies (currently none). If these Terms and the privacy policy conflict on how we process personal information, the privacy policy applies.
      </p>

      <h2>5. Links to other websites</h2>
      <p>
        The Site may link to other websites, such as trade show organisers. We do not control them and are not responsible for their content or
        practices. Their own terms and privacy policies apply when you use them.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent permitted by law, we make no warranties about the Site,
        including that it will be accurate, complete, uninterrupted, secure or free of errors or harmful code, and we disclaim all implied warranties, such
        as merchantability, fitness for a particular purpose and non-infringement.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for any lost profits, lost data, or indirect, incidental, special or consequential damages
        arising from your use of, or inability to use, the Site, and our total liability for any claim related to the Site is limited to 50 U.S. dollars.
        Nothing in these Terms limits or excludes liability that cannot be limited or excluded by law, such as liability for intentional misconduct, gross
        negligence, or death or personal injury caused by negligence.
      </p>

      <h2>8. Indemnity</h2>
      <p>
        If you use the Site in breach of these Terms or the law, you agree to cover the reasonable costs, including legal fees, of any third-party claim
        against us that results from that breach.
      </p>

      <h2>9. Ending your use</h2>
      <p>
        These Terms apply for as long as you use the Site. We may restrict or end your access at any time, for example if we believe you have breached these
        Terms. Sections 1 (Restrictions), 2, 3 and 6 to 10 continue to apply after that.
      </p>

      <h2>10. General</h2>
      <p>
        <b>Changes to these Terms.</b> We may update these Terms. We will post the new version on this page and change the date at the top. If you keep
        using the Site after a change, the updated Terms apply.
      </p>
      <p>
        <b>Governing law and courts.</b> These Terms are governed by the laws of <Ph>[Hungary]</Ph>, without regard to its conflict-of-law rules. The courts
        of <Ph>[Budapest, Hungary]</Ph> have exclusive jurisdiction over any dispute about the Site or these Terms, except that we may seek urgent relief to
        protect our intellectual property in any competent court. <Ph>[Decide with a lawyer: Hungarian law and courts, or Wisconsin for U.S. users.]</Ph>
      </p>
      <p>
        <b>Export.</b> You agree not to export or transfer any information from the Site in breach of U.S. or other applicable export control laws.
      </p>
      <p>
        <b>Electronic communications.</b> You agree that we may communicate with you electronically, for example by email, and that electronic
        communications meet any legal requirement for written notice.
      </p>
      <p>
        <b>Accessibility.</b> We want the Site to be usable by everyone, and we aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. If
        anything on the Site is hard to use, please tell us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
      <p>
        <b>Entire agreement.</b> These Terms, together with the privacy policy and cookie notice, are the entire agreement between you and us about the Site.
        If any part is found unenforceable, it will be changed only as much as needed to make it enforceable, and the rest continues to apply. If we do not
        enforce a provision, that is not a waiver. You may not assign these Terms without our written consent; we may assign them.
      </p>
      <p>
        <b>Copyright and trademarks.</b> Copyright © 2026 <Ph>[Full legal name]</Ph>. All rights reserved. The Beck To Nature name and logo are our
        trademarks <Ph>[or: trade names]</Ph> and may not be used without our written permission.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, or by post at <Ph>[registered address, Budapest, Hungary]</Ph>.
      </p>
    </LegalPage>
  );
}
