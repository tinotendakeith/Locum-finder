import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../components/public-layout";

const categories = [
  ["Contact details", "Names, email addresses, phone numbers, account credentials, facility contacts."],
  ["Professional profile", "Profession, specialties, location, biography, employment history, education, availability, and job applications."],
  ["Verification data", "Certificates, licences, qualifications, national identity references, and review outcomes."],
  ["Platform records", "Session cookies, account activity, audit events, notification preferences, and support messages."],
];

export default function PrivacyPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head">
          <span className="eyebrow">CDPA and SI155 notice</span>
          <h1>Privacy Notice</h1>
          <p>
            Locum Finder processes personal and sensitive professional data to connect healthcare facilities with verified locum
            professionals in Zimbabwe. This notice is written for product use and DPO/legal review before final publication.
          </p>
        </div>

        <section className="grid-2">
          <article className="card">
            <h2>What We Collect</h2>
            <div className="stack-list">
              {categories.map(([title, text]) => (
                <div className="mini-row" key={title}>
                  <strong>{title}</strong>
                  <p className="muted">{text}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="card compliance-panel">
            <h2>Why We Use It</h2>
            <ul className="check-list">
              <li>Create and secure accounts.</li>
              <li>Verify locum credentials and clinic profiles.</li>
              <li>Match candidates with vacancies and process applications.</li>
              <li>Send operational notifications chosen by the user.</li>
              <li>Maintain audit trails and respond to data-rights requests.</li>
            </ul>
            <Link href="/privacy/data-rights" className="btn">Exercise Data Rights</Link>
          </article>
        </section>

        <section className="section alt-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Your rights</span>
              <h2>Access, correction, deletion, objection, and export</h2>
            </div>
          </div>
          <div className="grid-3">
            <article className="card"><h3>Consent</h3><p className="muted">Registration captures explicit privacy notice acceptance and written consent for credential-related sensitive data.</p></article>
            <article className="card"><h3>Security</h3><p className="muted">Sessions use HTTP-only cookies, production secure flags, access controls, and restricted admin surfaces.</p></article>
            <article className="card"><h3>Retention</h3><p className="muted">Production retention schedules will define how long resumes, applications, documents, logs, and inactive accounts are kept.</p></article>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
