import { PublicFooter, PublicHeader } from "../../components/public-layout";

export default function TermsPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head">
          <span className="eyebrow">Platform rules</span>
          <h1>Terms of Service</h1>
          <p>Operational terms for clinics, hospitals, locum professionals, and administrators using Locum Finder.</p>
        </div>
        <div className="grid-2">
          <article className="card">
            <h2>For Locums</h2>
            <ul className="check-list">
              <li>Provide accurate professional, identity, certification, and availability information.</li>
              <li>Keep licences and practising certificates current before applying for work.</li>
              <li>Use clinic and patient-related information only for legitimate vacancy workflows.</li>
            </ul>
          </article>
          <article className="card">
            <h2>For Clinics</h2>
            <ul className="check-list">
              <li>Post lawful, accurate vacancies with clear role, location, schedule, and pay information.</li>
              <li>Use candidate data only for recruitment, compliance, and placement decisions.</li>
              <li>Respect candidate privacy, communication preferences, and data-rights requests.</li>
            </ul>
          </article>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
