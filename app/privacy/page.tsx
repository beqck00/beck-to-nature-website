import type { Metadata } from "next";
import LegalPage, { Ph } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy · Beck To Nature",
  description: "How Beck To Nature collects, uses and protects personal information.",
};

// Adapted from General Legal's "Privacy Policy (GDPR Enhanced)" template. The template assumes a U.S. company with no
// establishment in Europe; Beck To Nature is based in Budapest, so it is a controller directly under the GDPR and the
// Hungarian authority (NAIH) is its lead supervisory authority. Sections the site does not need (accounts, payments,
// advertising, contests, social logins, mobile apps) are left out. Describe only what the site actually does.
const EMAIL = "hello@becktonature.com";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated={<Ph>[date]</Ph>}>
      <p>
        <Ph>[Full legal name, e.g. Beck To Nature Kft.]</Ph> (&ldquo;<b>Beck To Nature</b>&rdquo;, &ldquo;<b>we</b>&rdquo;, &ldquo;<b>us</b>&rdquo; or
        &ldquo;<b>our</b>&rdquo;) helps Central European manufacturers enter the U.S. market, starting with U.S. trade shows. This privacy policy explains
        how we process personal information collected through our website at <Ph>[becktonature.com]</Ph> (the &ldquo;<b>Site</b>&rdquo;) and when you
        contact us about our services.
      </p>
      <p>
        If you are in the European Economic Area or the United Kingdom, the section <a href="#europe">Additional information for people in Europe</a> applies
        to you as well. If you are in the United States, see <a href="#us-states">U.S. state privacy rights</a>.
      </p>

      <h2>Who is responsible for your information</h2>
      <p>
        Beck To Nature is the controller of your personal information. You can reach us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, by post
        at <Ph>[registered address, Budapest, Hungary]</Ph>, or at our U.S. office at <Ph>[address, Hartland, Wisconsin]</Ph>.
        <Ph>[Company registration number and tax number, if you want them shown here.]</Ph>
      </p>

      <h2>Personal information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <b>Contact and communications data</b>, such as your name, job title, company, email address, phone number and the content of your messages,
          when you email or call us or meet us at an event.
        </li>
        <li>
          <b>Readiness check answers.</b> The readiness check on the Site asks about your company&rsquo;s industry, main product, certifications, U.S.
          presence and timing, and optionally your company name and location. It does not ask for your name or contact details. Please do not include
          personal information about yourself or others in the free-text answer.
        </li>
        <li>
          <Ph>
            [When the inquiry form goes live: <b>Inquiry form data</b>, such as your name, phone number, work email, company, country, industry, product
            stage, U.S. experience and preferred timing. If you agree, we may also send you a text message about your inquiry, including a reminder if you
            stop partway through the form.]
          </Ph>
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <b>Technical data.</b> When you visit the Site, our hosting provider, <Ph>[hosting provider, e.g. Vercel Inc.]</Ph>, automatically receives
          technical information such as your IP address, browser type, the pages requested and the time of the request, in order to deliver and protect
          the Site. <Ph>[Confirm the hosting provider and how long it keeps these logs.]</Ph>
        </li>
        <li>
          <b>Abuse protection.</b> To stop the readiness check from being misused, we briefly keep your IP address in the server&rsquo;s memory and count
          how many checks it has requested in the last 10 minutes. This count is not written to disk and is cleared when the server restarts.
        </li>
      </ul>
      <p>
        We do not use cookies, analytics, advertising or tracking tools on the Site. See our <a href="/cookies">cookie notice</a>.
      </p>

      <h2>How we use your personal information</h2>
      <ul>
        <li><b>To answer you and provide our services</b>, including preparing proposals and organising trade shows and buyer meetings you ask us to arrange.</li>
        <li>
          <b>To produce your readiness assessment.</b> When you submit the readiness check, we send your answers to our AI provider, Anthropic PBC, which
          generates the assessment shown to you. We do not save your answers or the assessment.
        </li>
        <li><b>To keep the Site secure and working</b>, including preventing misuse of the readiness check.</li>
        <li>
          <b>To keep in touch about our services.</b> We may follow up on a conversation you started with us. You can tell us to stop at any time. We will
          only send marketing messages where the law allows it, and with your consent where it is required.
        </li>
        <li><b>To meet our legal obligations</b>, such as accounting and tax rules, and to establish, exercise or defend legal claims.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for advertising or for automated decisions that have legal or similarly significant effects on you.</p>

      <h2>How we share your personal information</h2>
      <ul>
        <li>
          <b>Service providers</b> that help us run the Site and our business, such as our hosting provider, our AI provider Anthropic PBC (for the readiness
          check), our email provider <Ph>[email provider]</Ph> <Ph>[and, when the inquiry form goes live, our text message provider]</Ph>. They may use
          your information only to provide their services to us. <Ph>[Confirm Anthropic&rsquo;s commercial terms: by default it does not use API inputs to
          train its models.]</Ph>
        </li>
        <li>
          <b>Partners you ask us to involve</b>, such as trade show organisers, booth builders, logistics companies, U.S. regulatory consultants or the buyers
          we arrange meetings with, where this is needed to deliver the service you asked for.
        </li>
        <li><b>Professional advisers</b>, such as lawyers, accountants and insurers.</li>
        <li><b>Authorities</b>, where the law requires it or where it is needed to protect our rights or the safety of others.</li>
        <li><b>A buyer or successor</b>, if all or part of our business is sold, merged or reorganised.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep correspondence and inquiry information for as long as we are in contact with you and for <Ph>[24 months]</Ph> after our last contact,
        unless you become a client. Client records and invoices are kept for as long as Hungarian accounting and tax law requires, generally 8 years.
        Readiness check answers are not stored. When we no longer need personal information, we delete or anonymise it.
      </p>

      <h2>Security</h2>
      <p>
        We use technical and organisational measures designed to protect your personal information, such as encrypted connections to the Site and access
        controls. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>
        The Site is for businesses and is not intended for anyone under 18. If you believe a child has given us personal information, please contact us and
        we will delete it.
      </p>

      <h2 id="europe">Additional information for people in Europe</h2>
      <p>
        This section applies if you are in the European Economic Area (EEA) or the United Kingdom. &ldquo;Personal information&rdquo; in this policy means
        &ldquo;personal data&rdquo; as defined in the EU General Data Protection Regulation (GDPR) and the UK GDPR.
      </p>
      <h3>Legal bases</h3>
      <div className="legal-table">
        <table>
          <thead><tr><th>Purpose</th><th>Legal basis</th></tr></thead>
          <tbody>
            <tr><td>Answering your questions and providing our services</td><td>Taking steps at your request before entering into a contract, and performing our contract with you (Art. 6(1)(b) GDPR)</td></tr>
            <tr><td>Producing your readiness assessment</td><td>Taking steps at your request (Art. 6(1)(b) GDPR)</td></tr>
            <tr><td>Keeping the Site secure and preventing misuse</td><td>Our legitimate interest in running a safe, working website (Art. 6(1)(f) GDPR)</td></tr>
            <tr><td>Following up on a conversation and keeping in touch about our services</td><td>Our legitimate interest in developing our business (Art. 6(1)(f) GDPR), or your consent where the law requires it (Art. 6(1)(a) GDPR)</td></tr>
            <tr><td><Ph>[Text messages about your inquiry, when the inquiry form goes live]</Ph></td><td><Ph>[Your consent (Art. 6(1)(a) GDPR)]</Ph></td></tr>
            <tr><td>Accounting, tax and other legal obligations</td><td>Compliance with a legal obligation (Art. 6(1)(c) GDPR)</td></tr>
            <tr><td>Establishing, exercising or defending legal claims</td><td>Our legitimate interest in protecting our rights (Art. 6(1)(f) GDPR)</td></tr>
          </tbody>
        </table>
      </div>
      <h3>Your rights</h3>
      <p>You can ask us to:</p>
      <ul>
        <li><b>Access</b> your personal information and receive information about how we use it.</li>
        <li><b>Correct</b> information that is inaccurate or incomplete.</li>
        <li><b>Delete</b> your information where there is no good reason for us to keep it.</li>
        <li><b>Restrict</b> our use of your information, for example while we check its accuracy.</li>
        <li><b>Transfer</b> a machine-readable copy of your information to you or to someone you choose.</li>
        <li><b>Object</b> to our use of your information based on legitimate interests, and to direct marketing at any time.</li>
        <li><b>Withdraw consent</b> at any time, where we rely on it. This does not affect processing that already took place.</li>
      </ul>
      <p>
        Email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> to make a request. We may ask for information to confirm your identity. We will reply within one
        month, and tell you the reasons if we cannot fully meet your request.
      </p>
      <h3>Complaints</h3>
      <p>
        You can complain to a data protection authority, in particular in the EU country where you live or work. Our lead authority is the Hungarian
        National Authority for Data Protection and Freedom of Information (NAIH), 1055 Budapest, Falk Miksa utca 9–11, <a href="https://naih.hu">naih.hu</a>.
        In the UK, you can contact the Information Commissioner&rsquo;s Office, <a href="https://ico.org.uk">ico.org.uk</a>. We would appreciate the chance
        to deal with your concern first, so please contact us.
      </p>
      <h3>Transfers outside Europe</h3>
      <p>
        We work in Hungary and the United States, and some of our service providers, including Anthropic PBC, are based in the United States. When we
        transfer personal information outside the EEA or the UK, we rely on an adequacy decision, such as the EU&ndash;U.S. Data Privacy Framework where the
        recipient is certified under it, or on the European Commission&rsquo;s standard contractual clauses. <Ph>[Confirm which mechanism applies to each
        provider.]</Ph> You can ask us for a copy of the relevant safeguards.
      </p>

      <h2 id="us-states">U.S. state privacy rights</h2>
      <p>
        Depending on where you live, U.S. state privacy laws, such as those of California, Colorado, Connecticut, Virginia and Texas, may give you rights to
        know what personal information we have collected about you, to receive a copy, to correct it, to delete it, and to appeal if we decline your request.
        We do not sell or share personal information for targeted advertising, we do not use it for profiling with significant effects, and we do not
        knowingly collect personal information from anyone under 16.
      </p>
      <p>
        To make a request, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We may need to verify your identity, and you may use an authorised agent. We
        will not discriminate against you for exercising your rights. <Ph>[Check with a lawyer whether these state laws apply to Beck To Nature at its
        size; many apply only above revenue or data-volume thresholds.]</Ph>
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the new version on this page and change the date at the top. If the changes are
        significant, we will tell you more prominently.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or your personal information: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, or by post
        at <Ph>[registered address, Budapest, Hungary]</Ph>.
      </p>
    </LegalPage>
  );
}
