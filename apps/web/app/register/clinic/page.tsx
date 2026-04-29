import { PublicFooter, PublicHeader } from "../../../components/public-layout";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

function errorMessage(code: string) {
  if (code === "missing_fields") return "Please complete the required fields before continuing.";
  if (code === "email_exists") return "An account with that email already exists. Try logging in instead.";
  if (code === "consent_required") return "Please accept the privacy notice and data processing consent to create a clinic account.";
  return "";
}

export default async function RegisterClinicPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = errorMessage(valueOf(params.error));

  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head">
          <h1>Clinic Registration</h1>
          <p>Create your organization account, then complete your facility profile before posting jobs.</p>
        </div>
        <form className="card form-grid" action="/auth/register/clinic" method="post">
          <input className="input" name="facilityName" placeholder="Facility name" required />
          <input className="input" name="contactPerson" placeholder="Contact person" required />
          <input className="input" type="email" name="email" placeholder="Email" required />
          <input className="input" name="phone" placeholder="Phone" required />
          <input className="input" type="password" name="password" placeholder="Password" required />
          <div className="form-note card">
            <strong>What happens next</strong>
            <p>After this step, you will be taken to complete your facility profile so you can post vacancies.</p>
          </div>
          <div className="consent-box">
            <label className="checkbox-row">
              <input type="checkbox" name="acceptedPrivacyNotice" required />
              <span>I have read and accept the <a href="/privacy">Privacy Notice</a> and understand how Locum Finder processes my organization contact data.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="acceptedSensitiveDataUse" required />
              <span>I confirm that our clinic will only submit lawful vacancy and applicant-processing information through Locum Finder.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="marketingOptIn" />
              <span>Send optional service updates and partner offers. This can be changed later.</span>
            </label>
          </div>
          {error ? <p className="feedback error-text">{error}</p> : null}
          <button className="btn" type="submit">Create clinic account</button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
