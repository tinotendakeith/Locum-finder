import { PublicFooter, PublicHeader } from "../../../components/public-layout";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

export default async function DataRightsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const submitted = valueOf(params.submitted) === "1";

  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head">
          <span className="eyebrow">Data subject request</span>
          <h1>Privacy Rights Request</h1>
          <p>Ask Locum Finder to access, correct, delete, export, or restrict processing of your personal data.</p>
        </div>

        <div className="grid-2">
          <form className="card form-grid" action="/privacy/data-rights/request" method="post">
            <input className="input" name="name" placeholder="Full name" required />
            <input className="input" type="email" name="email" placeholder="Account email" required />
            <select className="select" name="requestType" required defaultValue="access">
              <option value="access">Access my data</option>
              <option value="correction">Correct my data</option>
              <option value="deletion">Delete my data</option>
              <option value="objection">Object or restrict processing</option>
              <option value="export">Export my data</option>
            </select>
            <textarea className="textarea" name="details" placeholder="Tell us what you need" required />
            {submitted ? <p className="feedback success-text">Request received. The DPO queue has been updated.</p> : null}
            <button className="btn" type="submit">Submit Request</button>
          </form>

          <aside className="card compliance-panel">
            <h2>How We Handle Requests</h2>
            <ul className="check-list">
              <li>Requests are logged for DPO review.</li>
              <li>Identity may be verified before disclosure or deletion.</li>
              <li>Operational notices remain available for account security.</li>
              <li>Production SLA target: complete valid requests within 30 days.</li>
            </ul>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
