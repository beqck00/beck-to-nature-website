import type { Metadata } from "next";
import LegalPage, { LEGAL_NAME, LEGAL_STATE, Mail, Ph, SITE } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of use · Beck To Nature", description: "The terms that apply when you use Beck To Nature's website." };

// Adapted from General Legal's "Website Terms of Use" template for a U.S. LLC. Left out because the Site does not
// have them: accounts and user-to-user features. The template's arbitration clause (with jury-trial and class-action
// waivers) is not included; disputes go to the courts named below. Whether to add it is a decision for a lawyer.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated={<>Version 1.0, <Ph>[date]</Ph></>}>
      <p>
        The website at {SITE} (the &ldquo;<b>Site</b>&rdquo;) is owned and operated by {LEGAL_NAME}, a {LEGAL_STATE} limited liability company
        (&ldquo;<b>Beck To Nature</b>&rdquo;, &ldquo;<b>we</b>&rdquo;, &ldquo;<b>us</b>&rdquo; or &ldquo;<b>our</b>&rdquo;). These terms of use (the
        &ldquo;<b>Terms</b>&rdquo;) govern your use of the Site. By using the Site, you agree to these Terms on behalf of yourself and the company you
        represent, and you confirm that you have the authority to do so. You must be at least 18 years old to use the Site. If you do not agree, please do not
        use the Site.
      </p>
      <p>These Terms cover the Site only. If you hire us, our services are governed by the separate written agreement we sign with you.</p>

      <h2>1. Using the Site</h2>
      <p>
        <b>1.1 Permission.</b> Subject to these Terms, we give you a limited, non-exclusive, non-transferable and revocable permission to use the Site to
        learn about our services and to get in touch with us.
      </p>
      <p>
        <b>1.2 Restrictions.</b> You may not: (a) sell, license or otherwise commercially exploit the Site or its content; (b) copy, modify, reverse-engineer
        or create derivative works from any part of the Site, except as the law allows; (c) use the Site to build a similar or competing service; (d) use
        automated means to scrape the Site or to submit the inquiry form in bulk; or (e) interfere with the Site&rsquo;s security or operation. Copyright and
        other notices must be kept on any copy you are permitted to make.
      </p>
      <p><b>1.3 Changes.</b> We may change, suspend or discontinue the Site, or any part of it, at any time and without notice. We have no obligation to provide support for the Site.</p>

      <h2>2. Inquiries and information on the Site</h2>
      <p>
        <b>2.1 No contract.</b> Sending an inquiry does not create a contract or any other obligation. Neither you nor we are committed to working together
        until both sign a written agreement.
      </p>
      <p>
        <b>2.2 General information.</b> What the Site says about trade shows, timing, buyers and the U.S. market is general information. It is not legal,
        regulatory, financial or business advice, and it is not a promise of any result. Regulatory requirements, for example those of the FDA, should be
        confirmed with a qualified specialist.
      </p>
      <p>
        <b>2.3 Confidential information.</b> Please do not send confidential information through the inquiry form or by email before we have a
        confidentiality agreement in place. We are glad to sign one first. Until then, we treat what you send us with care but without a duty of
        confidentiality.
      </p>
      <p><b>2.4 Text messages.</b> If you agree on the inquiry form to receive text messages, the terms in our <a href="/privacy#texts">privacy policy</a> apply. You can reply STOP at any time.</p>

      <h2>3. Ownership and feedback</h2>
      <p>
        The Site and its content, including text, design, logos and images, belong to Beck To Nature or its licensors and are protected by intellectual
        property laws. These Terms do not transfer any ownership rights to you. If you send us feedback or suggestions about the Site, you grant us a
        perpetual, irrevocable, worldwide, royalty-free right to use them for any purpose without any obligation to you.
      </p>

      <h2>4. Privacy</h2>
      <p>
        Our <a href="/privacy">privacy policy</a> explains how we handle personal information, and our <a href="/cookies">cookie notice</a> explains our use
        of cookies (currently none). If these Terms and the privacy policy conflict about how we handle personal information, the privacy policy applies.
      </p>

      <h2>5. Links to other websites</h2>
      <p>
        The Site may link to websites we do not operate, such as those of trade show organizers. We do not control or endorse them and are not responsible
        for their content or practices. Their own terms and privacy policies apply when you use them.
      </p>

      <h2>6. Disclaimers</h2>
      <p className="caps">
        THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;. TO THE FULLEST EXTENT PERMITTED BY LAW, BECK TO NATURE AND ITS SUPPLIERS
        DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. WE
        DO NOT WARRANT THAT THE SITE WILL BE ACCURATE, COMPLETE, UNINTERRUPTED, SECURE OR FREE OF ERRORS, VIRUSES OR OTHER HARMFUL CODE.
      </p>

      <h2>7. Limitation of liability</h2>
      <p className="caps">
        TO THE FULLEST EXTENT PERMITTED BY LAW: (A) BECK TO NATURE AND ITS SUPPLIERS WILL NOT BE LIABLE FOR ANY LOST PROFITS, LOST DATA, COSTS OF SUBSTITUTE
        SERVICES, OR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF, OR
        INABILITY TO USE, THE SITE; AND (B) OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE SITE IS LIMITED TO THE GREATER OF
        USD 50 AND THE AMOUNT YOU PAID US TO USE THE SITE IN THE SIX MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM. HAVING MORE THAN ONE CLAIM DOES NOT
        RAISE THIS LIMIT.
      </p>
      <p>
        Some jurisdictions do not allow certain warranties to be excluded or certain damages to be limited, so parts of sections 6 and 7 may not apply to you.
        Nothing in these Terms excludes or limits liability that cannot be excluded or limited under the law that applies to you.
      </p>

      <h2>8. Indemnification</h2>
      <p>
        You agree to defend, indemnify and hold harmless Beck To Nature and its members, managers, employees and agents from third-party claims, and the
        reasonable costs and attorneys&rsquo; fees they cause, that arise from your breach of these Terms or your violation of any law in using the Site. We
        will tell you promptly about any such claim, and you may not settle it without our written consent.
      </p>

      <h2>9. Term and termination</h2>
      <p>
        These Terms apply for as long as you use the Site. We may suspend or end your access at any time, including if we believe you have breached these
        Terms. Sections 1.2, 2, 3 and 6 to 11 continue to apply after your use of the Site ends.
      </p>

      <h2>10. Notice for California users</h2>
      <p>
        Under California Civil Code section 1789.3, California users are entitled to the following notice. The Site is provided
        by {LEGAL_NAME}, <Ph>[street address, Hartland, Wisconsin, ZIP, USA]</Ph>. The Site is free to use. To make a complaint about the Site or to ask for
        more information, write to that address or to <Mail />. You may also contact the Complaint Assistance Unit of the Division of Consumer Services of the
        California Department of Consumer Affairs at 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, or by telephone at (800) 952-5210.
      </p>

      <h2>11. General</h2>
      <p>
        <b>11.1 Changes to these Terms.</b> We may update these Terms. We will post the new version on this page and change the date at the top. If you keep
        using the Site after a change, the updated Terms apply.
      </p>
      <p>
        <b>11.2 Governing law and courts.</b> These Terms, and any dispute arising from or related to them or the Site, are governed by the laws of the State
        of {LEGAL_STATE}, without regard to its conflict-of-law rules. Any such dispute will be brought only in the state or federal courts located
        in <Ph>[Waukesha County, Wisconsin]</Ph>, and you and we consent to the jurisdiction of those courts. Either of us may still ask any court with
        jurisdiction for an injunction or similar relief to protect intellectual property, or bring an individual claim in small claims
        court. <Ph>[Decide with a lawyer: the state and county, and whether to add the template&rsquo;s arbitration clause with jury-trial and class-action
        waivers.]</Ph>
      </p>
      <p>
        <b>11.3 Users outside the United States.</b> We operate the Site from the United States. If you use it from another country, you are responsible for
        following the laws of that country. Rights that the law of your country gives you and that cannot be waived by agreement are not affected by these
        Terms.
      </p>
      <p><b>11.4 Export.</b> You agree not to export or transfer any information from the Site in violation of U.S. export control laws or the laws of any other country.</p>
      <p>
        <b>11.5 Electronic communications.</b> You agree that we may communicate with you electronically, for example by email or by notices on the Site, and
        that electronic communications satisfy any legal requirement for written notice.
      </p>
      <p>
        <b>11.6 Accessibility.</b> We want the Site to be usable by everyone, and we aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1,
        Level AA. If anything on the Site is hard to use, please tell us at <Mail /> and we will make reasonable efforts to fix it.
      </p>
      <p>
        <b>11.7 Entire agreement.</b> These Terms, together with the privacy policy and the cookie notice, are the entire agreement between you and us about
        the Site. If any part is found unenforceable, it will be changed only as far as needed to make it enforceable, and the rest continues to apply. If we
        do not enforce a provision, that is not a waiver of it. &ldquo;Including&rdquo; means &ldquo;including without limitation&rdquo;. You may not assign
        these Terms without our written consent; we may assign them.
      </p>
      <p>
        <b>11.8 Copyright and trademarks.</b> Copyright © 2026 {LEGAL_NAME}. All rights reserved. The Beck To Nature name and logo are our trademarks and may
        not be used without our written permission.
      </p>
      <p><b>11.9 Contact.</b> Questions about these Terms: <Mail />, or by post at <Ph>[street address, Hartland, Wisconsin, ZIP, USA]</Ph>.</p>
    </LegalPage>
  );
}
