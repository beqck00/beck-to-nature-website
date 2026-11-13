import type { Metadata } from "next";
import LegalPage, { LEGAL_NAME, LEGAL_STATE, Mail, Ph, SITE } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy policy · Beck To Nature", description: "How Beck To Nature collects, uses and protects personal information." };

// Adapted from General Legal's "Privacy Policy (GDPR Enhanced)" template, which is written for a U.S. company with
// no establishment in Europe. That is Beck To Nature's position as a U.S. LLC serving European companies.
// Describe only what the site actually does: an inquiry form that emails the team, no cookies, no analytics.
// Sections the site does not need (accounts, payments, advertising, contests, social logins, apps) are left out.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated={<Ph>[date]</Ph>}>
      <p>
        {LEGAL_NAME}, a {LEGAL_STATE} limited liability company (&ldquo;<b>Beck To Nature</b>&rdquo;, &ldquo;<b>we</b>&rdquo;, &ldquo;<b>us</b>&rdquo; or
        &ldquo;<b>our</b>&rdquo;), helps Central European manufacturers enter the U.S. market, starting with U.S. trade shows. This privacy policy explains how
        we handle personal information that we collect through our website at {SITE} (the &ldquo;<b>Site</b>&rdquo;), through the inquiry form on it, and when
        you contact us about our services.
      </p>
      <p>
        If you are in the European Economic Area or the United Kingdom, please also read <a href="#europe">Additional information for people in Europe</a>. If
        you live in the United States, see <a href="#us-states">U.S. state privacy rights</a>.
      </p>

      <h2>Who we are and how to reach us</h2>
      <p>
        Beck To Nature decides how and why your personal information is used. You can reach us at <Mail /> or by post
        at <Ph>[street address]</Ph>, Wake Forest, North Carolina, USA.
      </p>

      <h2>Personal information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <b>Inquiry form.</b> Your name, phone number, work email, company, country, industry, where your product stands today, whether you have tried the
          U.S. market before, when you would like to exhibit, and whether you agreed to receive text messages.
          When you enter your contact details and press Continue, those details are sent to us at that moment, so that we can follow up even if you do not
          finish the form. The form says so at that step.
        </li>
        <li>
          <b>Communications.</b> Your contact details and the content of your messages when you email, call or text us, or meet us at a trade show or other
          event.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <b>Technical data.</b> When you visit the Site, our hosting provider, <Ph>[hosting provider, e.g. Vercel Inc.]</Ph>, receives technical information
          such as your IP address, browser type, the pages requested and the time of the request, in order to deliver and protect the
          Site. <Ph>[Confirm the hosting provider and how long it keeps these logs.]</Ph>
        </li>
        <li>
          <b>Abuse protection.</b> To stop the inquiry form from being misused, our server keeps a count of how many inquiries your IP address has sent in the
          last 10 minutes. The count is held in memory only and is not written to disk.
        </li>
      </ul>
      <p>We do not use cookies, analytics, advertising pixels or similar tracking technologies on the Site. See our <a href="/cookies">cookie notice</a>.</p>
      <h3>Information from others</h3>
      <p>
        Occasionally a client, a trade show organizer or another business contact introduces a company to us and passes on a person&rsquo;s business contact
        details. We use them only to make contact about our services.
      </p>

      <h2>How we use personal information</h2>
      <ul>
        <li><b>To answer your inquiry and follow up</b>, including once if you gave us your contact details but did not finish the form.</li>
        <li><b>To provide our services</b>, such as preparing proposals and organizing trade shows and buyer meetings that you ask us to arrange.</li>
        <li><b>To send text messages you agreed to</b> (see <a href="#texts">Text messages</a>).</li>
        <li><b>To keep the Site secure and working</b>, including preventing misuse of the inquiry form.</li>
        <li>
          <b>To keep in touch about our services.</b> We may email you about our services after you contact us. Every such email tells you how to stop them,
          and you can also tell us to stop at any time. Where the law requires your consent first, we ask for it.
        </li>
        <li><b>To meet legal obligations</b>, such as tax and accounting rules, and to establish, exercise or defend legal claims.</li>
      </ul>
      <p>
        We do not sell personal information, we do not share it for advertising, and we do not use it to make automated decisions that have legal or similarly
        significant effects on you.
      </p>

      <h2 id="texts">Text messages</h2>
      <p>
        If you tick the box on the inquiry form, you agree to receive text messages from Beck To Nature about your inquiry at the phone number you gave.
        Message frequency varies. Message and data rates may apply. Reply STOP to any message to stop receiving them, or HELP for help. Agreeing to receive
        texts is not a condition of working with us or of buying anything.
      </p>
      <p>
        We do not share mobile phone numbers, or the fact that you agreed to receive text messages, with third parties or affiliates for their marketing
        purposes. <Ph>[Before sending texts, confirm this section with your text message provider: U.S. carriers require specific disclosures to register a
        sending number.]</Ph>
      </p>

      <h2>How we share personal information</h2>
      <ul>
        <li>
          <b>Service providers</b> that help us run the Site and our business: our hosting provider, our email delivery
          provider <Ph>[e.g. Resend]</Ph>, our email and office software provider <Ph>[provider]</Ph> <Ph>[and our text message provider]</Ph>. They may
          use the information only to provide their services to us.
        </li>
        <li>
          <b>Partners you ask us to involve</b>, such as trade show organizers, booth builders, logistics companies, U.S. regulatory consultants and the buyers
          we arrange meetings with, where that is needed to deliver the service you asked for.
        </li>
        <li><b>Professional advisers</b>, such as lawyers, accountants and insurers.</li>
        <li><b>Authorities and others</b>, where the law requires it or where it is needed to protect our rights or the safety of others.</li>
        <li><b>A buyer or successor</b>, if all or part of our business is sold, merged or reorganized.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep inquiries and correspondence for as long as we are in contact with you and for <Ph>[24 months]</Ph> after our last contact, unless you become
        a client. We keep client records and invoices for as long as U.S. tax and accounting rules require, generally <Ph>[seven]</Ph> years. When we no longer
        need personal information, we delete or anonymize it.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li><b>Emails and texts.</b> Use the unsubscribe link in an email, reply STOP to a text, or write to us.</li>
        <li><b>Your information.</b> Wherever you live, you can ask us what we hold about you, and ask us to correct or delete it, by writing to <Mail />.</li>
        <li>
          <b>Browser signals.</b> The Site does not track visitors across websites, so &ldquo;Do Not Track&rdquo; and Global Privacy Control signals do not
          change how it behaves.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        We use technical and organizational measures designed to protect personal information, such as encrypted connections to the Site and limited access
        to inquiries. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>
        The Site is for businesses and is not directed to anyone under 18. We do not knowingly collect personal information from children. If you believe a
        child has given us personal information, please contact us and we will delete it.
      </p>

      <h2>Where information is processed</h2>
      <p>
        We are based in the United States. Information you give us is processed in the United States, and may be processed in other countries where our
        service providers operate. Privacy laws in those countries may differ from the laws where you live.
      </p>

      <h2 id="europe">Additional information for people in Europe</h2>
      <p>
        This section applies if you are in the European Economic Area (EEA) or the United Kingdom. In it, &ldquo;personal information&rdquo; means
        &ldquo;personal data&rdquo; as defined in the EU General Data Protection Regulation and the UK GDPR (together, the &ldquo;GDPR&rdquo;).
      </p>
      <h3>Controller and representatives</h3>
      <p>
        Beck To Nature is the controller of your personal information. We are established in the United States and have no establishment in the EEA or the
        UK. <Ph>[If anyone works for the company from Hungary on an ongoing basis, ask a lawyer whether that counts as an establishment in the EU; it would
        change this section.]</Ph>
      </p>
      <p>
        <Ph>[EU representative under Article 27 GDPR: name, postal address and email, or a lawyer&rsquo;s confirmation that none is required.]</Ph>{" "}
        <Ph>[UK representative: the same.]</Ph>
      </p>
      <h3>Legal bases</h3>
      <div className="tbl">
        <table>
          <thead><tr><th>Purpose</th><th>Legal basis</th></tr></thead>
          <tbody>
            <tr><td>Answering your inquiry, following up, and providing our services</td><td>Taking steps at your request before entering into a contract, and performing our contract with you (Art. 6(1)(b) GDPR)</td></tr>
            <tr><td>Following up once when you gave contact details but did not finish the inquiry form</td><td>Our legitimate interest in responding to people who began an inquiry (Art. 6(1)(f) GDPR)</td></tr>
            <tr><td>Text messages about your inquiry</td><td>Your consent (Art. 6(1)(a) GDPR)</td></tr>
            <tr><td>Keeping the Site secure and preventing misuse</td><td>Our legitimate interest in running a safe, working website (Art. 6(1)(f) GDPR)</td></tr>
            <tr><td>Keeping in touch about our services</td><td>Our legitimate interest in developing our business (Art. 6(1)(f) GDPR), or your consent where the law requires it (Art. 6(1)(a) GDPR)</td></tr>
            <tr><td>Tax, accounting and other legal obligations</td><td>Compliance with a legal obligation (Art. 6(1)(c) GDPR) or, for obligations under U.S. law, our legitimate interest in meeting them (Art. 6(1)(f) GDPR)</td></tr>
            <tr><td>Establishing, exercising or defending legal claims</td><td>Our legitimate interest in protecting our rights (Art. 6(1)(f) GDPR)</td></tr>
          </tbody>
        </table>
      </div>
      <h3>Your rights</h3>
      <p>You can ask us to:</p>
      <ul>
        <li><b>Access</b> your personal information and tell you how we use it.</li>
        <li><b>Correct</b> information that is inaccurate or incomplete.</li>
        <li><b>Delete</b> your information where there is no good reason for us to keep it.</li>
        <li><b>Restrict</b> our use of your information, for example while we check its accuracy.</li>
        <li><b>Transfer</b> a machine-readable copy of your information to you or to someone you choose.</li>
        <li><b>Object</b> to our use of your information where we rely on legitimate interests, and to direct marketing at any time.</li>
        <li><b>Withdraw consent</b> at any time, where we rely on it. This does not affect what we did before you withdrew it.</li>
      </ul>
      <p>
        Write to <Mail /> to make a request. We may ask for information to confirm who you are. We will reply within one month and, if we cannot do what you
        ask, we will tell you why.
      </p>
      <h3>Complaints</h3>
      <p>
        You can complain to the data protection authority in the country where you live or work. The EEA authorities are listed
        at <a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en">edpb.europa.eu</a>; in the UK it is the Information Commissioner&rsquo;s
        Office, <a href="https://ico.org.uk">ico.org.uk</a>. We would appreciate the chance to deal with your concern first, so please contact us.
      </p>
      <h3>Processing outside Europe</h3>
      <p>
        Because we are a U.S. company, the information you give us is collected and processed in the United States. The European Commission has not decided
        that the United States as a whole provides an adequate level of data protection; its adequacy decision for the EU&ndash;U.S. Data Privacy Framework
        covers only organizations certified under that Framework. <Ph>[State whether Beck To Nature is certified under the Data Privacy Framework.]</Ph>
      </p>
      <p>
        Where we pass personal information on to a service provider, we rely on that provider&rsquo;s certification under the Framework or on the European
        Commission&rsquo;s standard contractual clauses, with the UK addendum where it applies. You can ask us for a copy of the safeguards that apply to your
        information.
      </p>
      <h3>Sensitive information and automated decisions</h3>
      <p>
        Please do not send us sensitive personal information, such as information about health, beliefs or ethnic origin. We do not make decisions about you
        by automated means alone.
      </p>

      <h2 id="us-states">U.S. state privacy rights</h2>
      <p>
        Several U.S. states, including California, give their residents rights over their personal information. Many of these laws apply only to businesses
        above certain size thresholds. Whether or not such a law applies to us, if you live in the United States you can ask us to tell you what personal
        information we hold about you and how we use it, to give you a copy, to correct it and to delete it.
      </p>
      <p>
        Write to <Mail />. We will confirm who you are using the contact details we already hold, and reply within 45 days. You may ask someone you have
        authorized in writing to make the request for you. If we decline a request, you can ask us to reconsider by replying to our decision. We will not
        treat you differently because you made a request.
      </p>
      <p>
        We do not sell personal information. We do not share it for cross-context behavioral advertising or use it for targeted advertising. We do not use
        sensitive personal information to infer characteristics about anyone, and we do not knowingly collect personal information from anyone under 16.
      </p>
      <p>
        <b>California.</b> We do not disclose personal information to third parties for their own direct marketing purposes (California Civil Code section
        1798.83). <b>Nevada.</b> We do not sell covered information as Nevada law defines it. <Ph>[Confirm with a lawyer which state privacy laws apply at
        the company&rsquo;s size.]</Ph>
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the new version on this page and change the date at the top. If a change is significant, we
        will make it more prominent, for example with a notice on the Site.
      </p>

      <h2>Contact us</h2>
      <p>Questions about this policy or your personal information: <Mail />, or by post at <Ph>[street address]</Ph>, Wake Forest, North Carolina, USA.</p>
    </LegalPage>
  );
}
