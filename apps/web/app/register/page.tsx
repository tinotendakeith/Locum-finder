import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../components/public-layout";

export default function RegisterPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Register</h1><p>Select account type to continue onboarding.</p></div>
        <div className="grid-3">
          <article className="card"><h3>Locum Professional</h3><p>Create a professional profile and apply for opportunities.</p><Link href="/register/locum" className="btn">Register as Locum</Link></article>
          <article className="card"><h3>Clinic / Facility</h3><p>Publish staffing opportunities and review locum applicants.</p><Link href="/register/clinic" className="btn">Register as Clinic</Link></article>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
