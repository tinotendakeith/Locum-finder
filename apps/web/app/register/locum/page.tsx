import { PublicFooter, PublicHeader } from "../../../components/public-layout";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

function errorMessage(code: string) {
  if (code === "missing_fields") return "Please complete the required fields before continuing.";
  if (code === "email_exists") return "An account with that email already exists. Try logging in instead.";
  if (code === "consent_required") return "Please accept the privacy notice and sensitive data consent to create a locum account.";
  return "";
}

export default async function RegisterLocumPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const returnTo = valueOf(params.returnTo);
  const error = errorMessage(valueOf(params.error));

  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head">
          <h1>Locum Registration</h1>
          <p>Create your account, then build one or more resumes you can reuse for fast applications.</p>
        </div>
        <form className="card form-grid" action="/auth/register/locum" method="post">
          <input className="input" name="firstName" placeholder="First name" required />
          <input className="input" name="lastName" placeholder="Last name" required />
          <input className="input" type="email" name="email" placeholder="Email" required />
          <input className="input" name="profession" placeholder="Primary profession" />
          <input className="input" name="phone" placeholder="Phone number" />
          <input className="input" type="password" name="password" placeholder="Password" required />
          <input type="hidden" name="returnTo" value={returnTo} />
          <div className="card form-note">
            <strong>What happens next</strong>
            <p>You will be guided to create a resume, upload key documents, and save multiple resume versions for different applications.</p>
          </div>
          <div className="consent-box">
            <label className="checkbox-row">
              <input type="checkbox" name="acceptedPrivacyNotice" required />
              <span>I have read and accept the <a href="/privacy">Privacy Notice</a> and understand how Locum Finder processes my personal data.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="acceptedSensitiveDataUse" required />
              <span>I give written consent for Locum Finder to process professional credentials, certificates, licences, and identity-related documents for verification and job matching.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="marketingOptIn" />
              <span>Send me optional product updates and partner opportunities. I can opt out later.</span>
            </label>
          </div>
          {error ? <p className="feedback error-text">{error}</p> : null}
          <button className="btn" type="submit">Create account</button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
